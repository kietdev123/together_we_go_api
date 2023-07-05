const mongoose = require("mongoose");

const Apply = require("../models/apply");
const Booking = require("../models/booking");

exports.createApply = async (req, res, next) => {
  const booking = await Booking.findById(req.body.booking_id);

  if (booking.authorId == req.body.applyer_Id){
    res.status(400).json({
      message: "Không thể tham gia vào chuyến đi của bạn, vui lòng chọn chuyến khác!",
    });
    return;
  }
  
  const oldApply = await Apply.findOne({
    applyer: new mongoose.Types.ObjectId(req.body.applyer_Id),
    booking: new mongoose.Types.ObjectId(req.body.booking_id),
    state: "waiting",
  });

  if (oldApply != null && oldApply != undefined) {
    res.status(400).json({
      message: "Bạn đã apply vào chuyến đi này rồi !",
    });
    return;
  }

  const apply = new Apply({
    applyer: new mongoose.Types.ObjectId(req.body.applyer_Id),
    note: req.body.note,
    deal_price: req.body.deal_price,
    booking: new mongoose.Types.ObjectId(req.body.booking_id),
    state: "waiting",
  });
  apply
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Apply added succesfully",
        post: {
          ...result,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fail to create apply!",
      });
    });
};

exports.updateApply = async (req, res, next) => {
  try {
    var applyId = req.params.id;

    const apply = await Apply.findByIdAndUpdate(applyId, req.body)
    .populate("booking");

    if (req.body.state == "close") {
      await Booking.findByIdAndUpdate(apply.booking._id, {status : 'complete'});
    }
    
    res.status(200).json({
      title: "pass",
    });
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};

exports.getMyApply = async (req, res, next) => {
  try {
    var applyerId = req.params.userId;

    var applys = await Apply.find({ applyer: applyerId })
      .populate("applyer")
      .populate({
        path: "booking",
        populate: {
          path: "authorId",
        },
      })
      .sort({'createdAt':-1});
  

    res.status(200).json(applys);
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};

exports.getApplyBooking = async (req, res, next) => {
  try {
    var bookingId = req.params.bookingId;

    var applys = await Apply.find({ booking: bookingId })
      .populate("applyer")
      .populate({
        path: "booking",
        populate: {
          path: "authorId",
        },
      })
      .sort({'createdAt':-1});

    res.status(200).json(applys);
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};
exports.getBookingInApply = async (req, res, next) => {
  try {
    var applyId = req.params.applyId;

    var apply = await Apply.findById(applyId).populate({
      path: "booking",
      populate: {
        path: "authorId",
      },
    });

    res.status(200).json(apply);
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};
