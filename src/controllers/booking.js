const Booking = require("../models/booking.js");
const mongoose = require("mongoose");
exports.createBooking = (req, res) => {
  const booking = new Booking({
    authorId: req.params.userId,
    price: req.body.price,
    status: req.body.status,
    bookingType: req.body.bookingType,
    time: req.body.time,
    content: req.body.content,
    startPointId: req.body.startPointId,
    startPointMainText: req.body.startPointMainText,
    startPointAddress: req.body.startPointAddress,
    endPointId: req.body.endPointId,
    endPointMainText: req.body.endPointMainText,
    endPointAddress: req.body.endPointAddress,
    duration: req.body.duration,
    distance: req.body.distance,
  });
  console.log(booking);
  booking
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Booking added succesfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fail to create todo!",
      });
    });
};
exports.getAllListBooking = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("authorId");
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getListAvailableBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "complete" }).populate(
      "authorId"
    );
    res.status(200).json(bookings);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
