const express = require("express");
const router = express.Router();
const applyController = require("../controllers/apply");

router.post("/", applyController.createApply);
router.patch("/:id", applyController.updateApply);
router.get("/getMyApply/:userId", applyController.getMyApply);
router.get("/getApplyBooking/:bookingId", applyController.getApplyBooking);
router.get("/getBookingInApply/:applyId", applyController.getBookingInApply);
module.exports = router;
