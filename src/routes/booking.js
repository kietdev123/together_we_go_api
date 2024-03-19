const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const adminBookingController = require("../controllers/admin/booking.js");

//admin
router.get("/admin", adminBookingController.getList);

//user
router.get("/recommend", bookingController.getRecommend);
router.get("/my-list", bookingController.getMyList);
router.get("/:id", bookingController.getOne);
router.put("/:id", bookingController.update);
router.get("/", bookingController.getList);
router.post("/", bookingController.create);

module.exports = router;
