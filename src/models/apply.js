const mongoose = require("mongoose");
const { APPLY_STATE } = require("../contrants.js");

const applySchema = new mongoose.Schema(
  {
    applyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    deal_price: { type: Number },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
    note: { type: String },
    state: { type: String, enum : APPLY_STATE }, // waiting / accepted->starting->close / refuse
  },
  { timestamps: true }
);

module.exports = mongoose.model("apply", applySchema);
