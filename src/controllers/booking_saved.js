const Booking = require("../models/booking");
const user = require("../models/user.js");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const dataName = "booking_saved";

exports.add = async (req, res, next) => {
    try {
      await Booking.updateOne({ _id: req.params.id }, {
        $addToSet : {
          userFavorites: req.user.user_id,
        } 
      })
      
      return sendSuccess(res, `Add 1 ${dataName} successfully`);
    } catch (e) {
      console.log(e);
      return sendServerError(res);
    }
  };

  exports.delete = async (req, res, next) => {
  try {
    await Booking.updateOne({ _id: req.params.id }, {
      $pull : {
        userFavorites: req.user.user_id,
      } 
    })
    return sendSuccess(res, `Delete 1 ${dataName} successfully`);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

