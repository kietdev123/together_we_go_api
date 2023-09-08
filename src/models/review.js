const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    creater: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    apply: { type: mongoose.Schema.Types.ObjectId, ref: "apply" },
    note: { type: String, default: "" },
    star: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
