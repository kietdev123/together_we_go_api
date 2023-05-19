const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    creater: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    apply: { type: mongoose.Schema.Types.ObjectId, ref: "apply" },
    review_note: { type: String, default: "" },
    review_star: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
