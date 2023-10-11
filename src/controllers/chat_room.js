const mongoose = require("mongoose");
const ChatRoom = require("../models/chat_room.js");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const message_name = "chat_room";

exports.create = async (req, res, next) => {
  try {
    let data = new ChatRoom({
      userId1: new mongoose.Types.ObjectId(req.body.userId1),
      userId2: new mongoose.Types.ObjectId(req.body.userId2),
      user1: new mongoose.Types.ObjectId(req.body.userId1),
      user2: new mongoose.Types.ObjectId(req.body.userId2),
    });
    await data.save();
    return sendSuccess(res, `${message_name} added succesfully`, data);
  }
  catch (err) {
    console.log(error);
    return sendServerError(res);
  }
 
};

exports.getList = async (req, res, next) => {
  try {
    let filter = {};
    let {page, pageSize, sortCreatedAt, sortUpdatedAt, user1Id, user2Id} = req.query;
    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;

    if (user1Id && !user2Id){
      filter = {
        $or: [
          {
            userId1: new mongoose.Types.ObjectId(user1Id),
          },
          {
            userId2: new mongoose.Types.ObjectId(user1Id),
          },
        ],
      }
    }
    if (!user1Id && user2Id){
      filter = {
        $or: [
          {
            userId1: new mongoose.Types.ObjectId(user2Id),
          },
          {
            userId2: new mongoose.Types.ObjectId(user2Id),
          },
        ],
      }
    }
    if (user1Id && user2Id){
      filter = {
        $or: [
          {
            userId1: new mongoose.Types.ObjectId(user1Id),
            userId2: new mongoose.Types.ObjectId(user2Id),
          },
          {
            userId2: new mongoose.Types.ObjectId(user1Id),
            userId1: new mongoose.Types.ObjectId(user2Id),
          },
        ],
      }
    }

    let _sort = {};
    if (sortCreatedAt) _sort.createdAt = Number(sortCreatedAt);
    if (sortUpdatedAt) _sort.updatedAt = Number(sortUpdatedAt);

    const datas = await ChatRoom
    .find(filter)
    .sort(_sort)
    .skip(skipNum)
    .limit(pageSize)
    .populate("user1")
    .populate("user2")
    .populate("lastMessage");
    
    return sendSuccess(res,`Get ${message_name} succesfully`, datas, datas.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.getOne = async (req, res) => {
  try {
    let data = await ChatRoom.findById(req.params.id)
      // .populate("user1", { id: 1, firstName: 1 })
      // .populate("user2", { id: 1, firstName: 1 });
      .populate("user1")
      .populate("user2")
      .populate("lastMessage");
    
    return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

