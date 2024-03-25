const mongoose = require("mongoose");
const userSchema = require("./user.js");
const Booking = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  status: {
    type: Number,
    require: true, 
    // available, complete
    // 2 1
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
    type: Date,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  startPointLat: {
    type: Number,
    require: true,
  },
  startPointLong: {
    type: Number,
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
  startAddress: {
    level1: { type: String, default: ""  },
    level2: { type: String, default: ""  },
    level3: { type: String, default: ""  },
    level4: { type: String, default: ""  },
  },
  endPointLat: {
    type: Number,
    require: true,
  },
  endPointLong: {
    type: Number,
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
  endAddress: {
    level1: { type: String, default: ""  },
    level2: { type: String, default: ""  },
    level3: { type: String, default: ""  },
    level4: { type: String, default: ""  },
  },
  distance: {
    type: String,
    require: true,
  },
  duration: {
    type: String,
    require: true,
  },
  point: {
    type: Number,
  }
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

Booking.index({
  startPointMainText: 'text',
  startPointAddress: 'text',
  endPointMainText: 'text',
  endPointAddress: 'text',
  content: 'text',
})
module.exports = mongoose.model("booking", Booking);
