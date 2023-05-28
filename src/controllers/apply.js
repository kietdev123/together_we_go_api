const mongoose = require("mongoose");

const Apply = require("../models/apply");

exports.createApply = (req, res, next) => {
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

    await Apply.findByIdAndUpdate(applyId, req.body);

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
      });

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
      });

    res.status(200).json(applys);
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};
