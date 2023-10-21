const mongoose = require("mongoose");
const Apply = require("../models/apply");
const Booking = require("../models/booking");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const message_name = "booking";

exports.create = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.body.booking);

    if (booking.authorId == req.body.user_id){
      return sendError(res, "Không thể tham gia vào chuyến đi của bạn, vui lòng chọn chuyến khác!");
    }
    
    const oldApply = await Apply.findOne({
      applyer: new mongoose.Types.ObjectId(req.user.user_id),
      booking: new mongoose.Types.ObjectId(req.body.booking),
      state: "waiting",
    });

    if (oldApply != null && oldApply != undefined) {
      return sendError(res, "Bạn đã apply vào chuyến đi này rồi !");
    }

    let data = new Apply({
      applyer: new mongoose.Types.ObjectId(req.user.user_id),
      note: req.body.note,
      dealPrice: Number(req.body.dealPrice),
      booking: new mongoose.Types.ObjectId(req.body.booking),
      state: "waiting",
    });

    await data.save();
    return sendSuccess(res, "Apply added succesfully", data);

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};

exports.update = async (req, res, next) => {
  try {
    let id = req.params.id;

    const data = await Apply.findByIdAndUpdate(id, req.body)
    .populate("booking");

    if (req.body.state == "close") {
      await Booking.findByIdAndUpdate(apply.booking.id, {status : 'complete'});
    }

    return sendSuccess(res, `Update 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getList = async (req, res, next) => {
  try {
    let filter = {};
    let {page, pageSize, sortCreatedAt, sortUpdatedAt, applyer_id, booking_id} = req.query;
    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;

    if (applyer_id) filter.applyer = new mongoose.Types.ObjectId(applyer_id);
    if (booking_id) filter.booking = new mongoose.Types.ObjectId(booking_id);

    let _sort = {};
    if (sortCreatedAt) _sort.createdAt = Number(sortCreatedAt);
    if (sortUpdatedAt) _sort.updatedAt = Number(sortUpdatedAt);

    const datas = await Apply
    .find(filter)
    .sort(_sort)
    .skip(skipNum)
    .limit(pageSize)
    .populate("applyer")
    .populate({
      path: "booking",
      populate: {
        path: "authorId",
      },
    });
    
    return sendSuccess(res,`Get ${message_name} succesfully`, datas, datas.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.getOne = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await Apply.findById(id)
    .populate("applyer")
    .populate({
      path: "booking",
      populate: {
        path: "authorId",
      },
    });
    return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};
