const mongoose = require("mongoose");

const bookingSavedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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


module.exports = mongoose.model("booking_saved", bookingSavedSchema);
