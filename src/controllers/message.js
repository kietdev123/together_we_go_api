const Message = require("../models/message");
const ChatRoom = require("../models/chat_room");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const message_name = "message";
const mongoose = require("mongoose");
const chatFeature = require("../sockets/features/chat.feature.js");

exports.create = async (req, res, next) => {
  try {
    let data = new Message({
      chatRoomId: new mongoose.Types.ObjectId(req.body.chatRoomId),
      userId: new mongoose.Types.ObjectId(req.user.user_id),
      message : req.body.message,
      type : req.body.type,
    });

    await data.save();

    chatFeature.sendMessage(data);

    return sendSuccess(res, `${message_name} added succesfully`, data);

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};

exports.update = async (req, res, next) => {
  try {
    let id = req.params.id;

    const data = await Message.findByIdAndUpdate(id, req.body, { new : true})

    return sendSuccess(res, `Update 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getList = async (req, res, next) => {
  try {
    let filter = {};
    let {page, pageSize, sortCreatedAt, sortUpdatedAt, chat_room_id} = req.query;
    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;

    if (chat_room_id) filter.chatRoomId = new mongoose.Types.ObjectId(chat_room_id);

    let _sort = {};
    if (sortCreatedAt) _sort.createdAt = Number(sortCreatedAt);
    if (sortUpdatedAt) _sort.updatedAt = Number(sortUpdatedAt);

    const datas = await Message
    .find(filter)
    .sort(_sort)
    .skip(skipNum)
    .limit(pageSize)
    
    return sendSuccess(res,`Get ${message_name} succesfully`, datas, datas.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};