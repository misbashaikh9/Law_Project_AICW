const express = require("express");
const router = express.Router();
const axios = require("axios");

const AI_SERVICE_URL = "https://lawbridge-ai-ai-service.onrender.com/predict";
const AI_SERVICE_HEALTH_URL = "https://lawbridge-ai-ai-service.onrender.com/";
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const AI_HEALTH_TIMEOUT_MS = 10000;
const AI_REQUEST_TIMEOUT_MS = 20000;
const AI_WARMUP_WINDOW_MS = 90000;
const AI_WARMUP_RETRY_DELAY_MS = 2000;
const AI_READY_CACHE_MS = 2 * 60 * 1000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let aiWarmupPromise = null;
let aiLastReadyAt = 0;

function isRetryableAiError(error) {
  const status = error.response?.status;

  return !status || RETRYABLE_STATUS_CODES.has(status) || error.code === "ECONNABORTED";
}

async function probeAiServiceReadiness(deadline) {
  let lastError;

  while (Date.now() < deadline) {
    try {
      await axios.get(AI_SERVICE_HEALTH_URL, { timeout: AI_HEALTH_TIMEOUT_MS });
      aiLastReadyAt = Date.now();
      return;
    } catch (error) {
      lastError = error;

      if (!isRetryableAiError(error)) {
        throw error;
      }

      const remaining = deadline - Date.now();

      if (remaining <= 0) {
        break;
      }

      await delay(Math.min(AI_WARMUP_RETRY_DELAY_MS, remaining));
    }
  }

  throw lastError || new Error("AI service warmup timed out");
}

async function ensureAiServiceReady({ force = false } = {}) {
  const recentlyReady = Date.now() - aiLastReadyAt < AI_READY_CACHE_MS;

  if (!force && recentlyReady) {
    return;
  }

  if (!aiWarmupPromise) {
    const deadline = Date.now() + AI_WARMUP_WINDOW_MS;

    aiWarmupPromise = probeAiServiceReadiness(deadline).finally(() => {
      aiWarmupPromise = null;
    });
  }

  return aiWarmupPromise;
}

async function requestAiAnalysis(question) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await ensureAiServiceReady({ force: attempt > 0 });

      const response = await axios.post(
        AI_SERVICE_URL,
        { text: question },
        { timeout: AI_REQUEST_TIMEOUT_MS }
      );

      aiLastReadyAt = Date.now();

      return response.data;
    } catch (error) {
      lastError = error;

      const isRetryable = isRetryableAiError(error);

      if (!isRetryable || attempt === 1) {
        throw error;
      }

      aiLastReadyAt = 0;
      await delay(1200);
    }
  }

  throw lastError;
}

async function warmupAiService() {
  await ensureAiServiceReady({ force: true });
}

router.get("/warmup", async (req, res) => {
  try {
    await warmupAiService();
    return res.json({ status: "ready" });
  } catch (error) {
    const status = error.response?.status;

    console.error("AI WARMUP ERROR:", status || error.code || error.message);

    return res.status(503).json({
      error: "AI service is temporarily unavailable",
      code: "AI_TEMPORARILY_UNAVAILABLE",
    });
  }
});

router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const aiResponse = await requestAiAnalysis(question.trim());

    res.json(aiResponse);
  } catch (error) {
    const status = error.response?.status;
    const upstreamMessage = error.response?.data?.detail || error.response?.data?.error;

    console.error("AI ERROR:", status || error.code || error.message, upstreamMessage || "");

    if (status === 503 || status === 502 || status === 504 || error.code === "ECONNABORTED") {
      return res.status(503).json({
        error: "AI service is temporarily unavailable",
        code: "AI_TEMPORARILY_UNAVAILABLE",
      });
    }

    return res.status(500).json({
      error: "AI service failed",
      code: "AI_REQUEST_FAILED",
    });
  }
});

module.exports = router;