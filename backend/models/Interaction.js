const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  query: { type: String, required: true },
  category: { type: String },
  severity: { type: String },
  emailGenerated: { type: Boolean, default: false },
  selectedLawyer: {
    name: String,
    contact: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interaction", InteractionSchema);
