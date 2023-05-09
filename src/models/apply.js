const mongoose = require("mongoose");

const applySchema = new mongoose.Schema({
  applyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  deal_price: { type: Number },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
  note: { type: String },
  state: { type: String }, // waiting accepted refuse close
});

module.exports = mongoose.model("apply", applySchema);
