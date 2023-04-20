const mongoose = require("mongoose");
const userSchema = require("./user.js");
const Booking = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userSchema,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    default: null,
  },
  bookingType: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  startPoint: {
    type: String,
    require: true,
  },
  startPointAddress: {
    type: String,
    require: true,
  },

  endPoint: {
    type: String,
    require: true,
  },
  endPointAddress: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("booking", Booking);
