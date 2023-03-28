const mongoose = require("mongoose");
const ChatRoom = require("../models/chat_room");
const User = require("../models/user");

exports.createChatRoom = (req, res, next) => {
  const chat_room = new ChatRoom({
    userId_1: req.body.userId_1,
    userId_2: req.body.userId_2,
  });
  chat_room
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Chat room added succesfully",
        post: {
          ...result,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fail to create chat room!",
      });
    });
};

exports.getAllChatRoomWithUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    // var chatRoom = await ChatRoom.find({ userId_1: userId });
    // console.log(chatRoom);

    const result = await ChatRoom.aggregate([
      {
        $match: {
          $or: [
            { userId_1: new mongoose.Types.ObjectId(userId) },
            { userId_2: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId_1",
          foreignField: "_id",
          as: "user1",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId_2",
          foreignField: "_id",
          as: "user2",
        },
      },
      {
        $project: {
          _id: 1, // "1" means on
          userId_1: 1,
          userId_2: 1,
          user1: 1, // "0" means off
          user2: 1,
        },
      },
    ]);

    var customJsons = [];
    for (var i = 0; i < result.length; i++) {
      newChatRoom = result[i];

      newChatRoom.user1 = newChatRoom.user1[0];
      newChatRoom.user2 = newChatRoom.user2[0];

      var finalChatRoom = {};
      if (newChatRoom.userId_1 == userId) {
        finalChatRoom = {
          id: newChatRoom._id,
          partner_name: newChatRoom.user2.first_name,
          partner_gmail: newChatRoom.user2.email,
        };
      } else {
        finalChatRoom = {
          id: newChatRoom._id,
          partner_name: newChatRoom.user1.first_name,
          partner_gmail: newChatRoom.user1.email,
        };
      }
      result[i] = finalChatRoom;
    }
    // console.log(result);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//End region
