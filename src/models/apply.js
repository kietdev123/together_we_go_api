const mongoose = require("mongoose");

const applySchema = new mongoose.Schema(
  {
    applyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    deal_price: { type: Number },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
    note: { type: String },
    state: { type: String }, // waiting / accepted->starting->close / refuse
  },
  { timestamps: true }
);

module.exports = mongoose.model("apply", applySchema);
