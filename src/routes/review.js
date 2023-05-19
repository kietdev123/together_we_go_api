const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.js");

router.post("", reviewController.createReview);
router.get("/:userId", reviewController.getReviewWithUserId);
module.exports = router;
