const mongoose = require("mongoose");

const bookingVectorSchema = new mongoose.Schema({
    'startPointGeoHash' : 	{
        type: String,
    },
    'endPointGeoHash' :  {
        type: String,
    },
    "time" : {
        type: Date,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
    },
},
{
  toJSON: {
      transform: (doc, obj) => {
        obj.id = obj._id;
        delete obj.__v;
        delete obj._id;
        return obj;
    }
  }
});


module.exports = mongoose.model("booking_vector", bookingVectorSchema);
