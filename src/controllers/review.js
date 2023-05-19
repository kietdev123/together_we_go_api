const mongoose = require("mongoose");

const Review = require("../models/review");

exports.createReview = (req, res, next) => {
  const review = new Review({
    creater: new mongoose.Types.ObjectId(req.body.creater_id),
    receiver: new mongoose.Types.ObjectId(req.body.receiver_id),
    apply: new mongoose.Types.ObjectId(req.body.apply_id),
    review_note: req.body.review_note,
    review_star: req.body.review_star,
  });
  review
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Review added succesfully",
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

exports.getReviewWithUserId = async (req, res, next) => {
  try {
    var userId = req.params.userId;

    var reviews = await Review.find({
      receiver: userId,
    })
      .populate("creater")
      .populate("receiver")
      .populate("apply");

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({
      title: "error",
      message: err.message,
    });
  }
};
