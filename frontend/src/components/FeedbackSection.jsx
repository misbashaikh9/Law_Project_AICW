import { useState } from "react";
import axios from "axios";

export default function FeedbackSection({ interactionId, backendUrl }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleStarClick = (star) => {
    setRating(star);
    if (star > 3) setFeedback("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interactionId || !rating) return;
    setSubmitting(true);
    try {
      await axios.put(
        `${backendUrl}/api/update-interaction/${interactionId}`,
        { review: { rating, feedback } }
      );
      setSuccess(true);
    } catch (err) {
      console.error("Feedback submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mt-4 text-green-600 font-semibold text-center">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
      <div className="text-sm text-gray-700 mb-2">Rate this solution</div>
      <div className="flex flex-row gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`text-2xl transition focus:outline-none ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-500`}
            onClick={() => handleStarClick(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            disabled={submitting}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && rating <= 3 && (
        <textarea
          className="w-full max-w-xs p-2 border border-gray-300 rounded mb-2 text-sm"
          rows={3}
          placeholder="Please let us know how we can improve..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={submitting}
        />
      )}
      <button
        type="submit"
        className={`mt-2 px-4 py-1.5 rounded bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition disabled:opacity-50`}
        disabled={!rating || submitting || !interactionId}
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
