const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");

router.get("/my-list", bookingController.getMyList);
router.get("/:id", bookingController.getOne);
router.get("/", bookingController.getList);
router.post("/", bookingController.create);

module.exports = router;
