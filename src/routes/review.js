const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.js");

router.post("/", reviewController.create);
router.get("/", reviewController.getList);

module.exports = router;
