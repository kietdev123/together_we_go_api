const mongoose = require("mongoose");
const userSchema = require("./user.js");
const Booking = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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
  startPointLat: {
    type: String,
    require: true,
  },
  startPointLong: {
    type: String,
    require: true,
  },
  startPointId: {
    type: String,
    require: true,
  },
  startPointMainText: {
    type: String,
    require: true,
  },
  startPointAddress: {
    type: String,
    require: true,
  },
  endPointLat: {
    type: String,
    require: true,
  },
  endPointLong: {
    type: String,
    require: true,
  },
  endPointId: {
    type: String,
    require: true,
  },
  endPointMainText: {
    type: String,
    require: true,
  },
  endPointAddress: {
    type: String,
    require: true,
  },
  distance: {
    type: String,
    require: true,
  },
  duration: {
    type: String,
    require: true,
  },
},
{
  timestamps: true,
  toJSON: {
      transform: (doc, obj) => {
        obj.id = obj._id;
        delete obj.__v;
        delete obj._id;
        return obj;
    }
  }
}
);


module.exports = mongoose.model("booking", Booking);
