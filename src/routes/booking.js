const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");

router.post("/createBooking/:userId", bookingController.createBooking);
router.get("/getAllListBooking", bookingController.getAllListBooking);
module.exports = router;
