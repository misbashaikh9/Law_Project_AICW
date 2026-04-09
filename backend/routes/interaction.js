const express = require("express");
const router = express.Router();
const Interaction = require("../models/Interaction");

// POST /save-interaction
router.post("/save-interaction", async (req, res) => {
  try {
    const { userId, query, category, severity } = req.body;
    const interaction = new Interaction({ userId, query, category, severity });
    await interaction.save();
    res.status(201).json(interaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to save interaction" });
  }
});

// PUT /update-interaction/:id
router.put("/update-interaction/:id", async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.emailGenerated === "boolean") {
      update.emailGenerated = req.body.emailGenerated;
    }
    if (req.body.selectedLawyer) {
      update.selectedLawyer = req.body.selectedLawyer;
    }
    const interaction = await Interaction.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    if (!interaction) return res.status(404).json({ error: "Not found" });
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to update interaction" });
  }
});

module.exports = router;
