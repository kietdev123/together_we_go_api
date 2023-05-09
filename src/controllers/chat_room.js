const mongoose = require("mongoose");
const ChatRoom = require("../models/chat_room");
const User = require("../models/user");
const chat_room = require("../models/chat_room");

exports.createChatRoom = (req, res, next) => {
  const chat_room = new ChatRoom({
    userId_1: new mongoose.Types.ObjectId(req.body.userId_1),
    userId_2: new mongoose.Types.ObjectId(req.body.userId_2),
    user1: new mongoose.Types.ObjectId(req.body.userId_1),
    user2: new mongoose.Types.ObjectId(req.body.userId_2),
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

    // const result = await ChatRoom.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { userId_1: new mongoose.Types.ObjectId(userId) },
    //         { userId_2: new mongoose.Types.ObjectId(userId) },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId_1",
    //       foreignField: "_id",
    //       as: "user1",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId_2",
    //       foreignField: "_id",
    //       as: "user2",
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1, // "1" means on
    //       userId_1: 1,
    //       userId_2: 1,
    //       user1: 1, // "0" means off
    //       user2: 1,
    //     },
    //   },
    // ]);

    // console.log(result);

    var result = await ChatRoom.find({
      $or: [
        { userId_1: new mongoose.Types.ObjectId(userId) },
        { userId_2: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("user1")
      .populate("user2")
      .populate("lastMessage");

    // console.log(result);
    var customChatRoom = [];

    for (var i = 0; i < result.length; i++) {
      var newChatRoom = result[i];

      var finalChatRoom = {};
      if (newChatRoom.userId_1 == userId) {
        finalChatRoom = {
          id: newChatRoom._id,
          partner_name: newChatRoom.user2.first_name,
          partner_gmail: newChatRoom.user2.email,
          partner_avatar: newChatRoom.user2.avatarUrl,
          partner_id: newChatRoom.user2._id,
          num_unwatch: newChatRoom.num_unwatched_1,
          lastMessage: newChatRoom.lastMessage,
        };
      } else {
        finalChatRoom = {
          id: newChatRoom._id,
          partner_name: newChatRoom.user1.first_name,
          partner_gmail: newChatRoom.user1.email,
          partner_avatar: newChatRoom.user1.avatarUrl,
          partner_id: newChatRoom.user1._id,
          num_unwatch: newChatRoom.num_unwatched_2,
          lastMessage: newChatRoom.lastMessage,
        };
      }
      if (finalChatRoom.lastMessage == undefined) {
        finalChatRoom.lastMessage = {
          message: "Hộp thoại trống",
          type: "isText",
          createdAt: new Date().toISOString(),
        };
      }
      result[i] = finalChatRoom;
      customChatRoom.push(finalChatRoom);
    }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//End region

exports.getOne = async (req, res) => {
  try {
    var chatRoom = await ChatRoom.findById(req.params.chatRoomId)
      // .populate("user1", { id: 1, first_name: 1 })
      // .populate("user2", { id: 1, first_name: 1 });
      .populate("user1")
      .populate("user2")
      .populate("lastMessage");
    res.status(200).json(chatRoom);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getChatRoomInBooking = async (req, res) => {
  try {
    console.log(req.params);
    var chatRoom = await ChatRoom.findOne({
      $or: [
        { userId_1: req.params.posterId, userId_2: req.params.current_user_id },
        { userId_2: req.params.posterId, userId_1: req.params.current_user_id },
      ],
    })
      // .populate("user1", { id: 1, first_name: 1 })
      // .populate("user2", { id: 1, first_name: 1 });
      .populate("user1")
      .populate("user2")
      .populate("lastMessage");

    console.log("kiet ", chatRoom);

    if (chatRoom == null) {
      console.log("heelo");
      chatRoom = new ChatRoom({
        userId_1: new mongoose.Types.ObjectId(req.params.posterId),
        userId_2: new mongoose.Types.ObjectId(req.params.current_user_id),
        user1: new mongoose.Types.ObjectId(req.params.posterId),
        user2: new mongoose.Types.ObjectId(req.params.current_user_id),
      });
      await chatRoom.save();

      chatRoom = await ChatRoom.findOne({
        $or: [
          {
            userId_1: req.params.posterId,
            userId_2: req.params.current_user_id,
          },
          {
            userId_2: req.params.posterId,
            userId_1: req.params.current_user_id,
          },
        ],
      })
        // .populate("user1", { id: 1, first_name: 1 })
        // .populate("user2", { id: 1, first_name: 1 });
        .populate("user1")
        .populate("user2")
        .populate("lastMessage");
    }
    var newChatRoom = chatRoom;

    var finalChatRoom = {};

    finalChatRoom = {
      id: newChatRoom._id,
      partner_name: newChatRoom.user2.first_name,
      partner_gmail: newChatRoom.user2.email,
      partner_avatar: newChatRoom.user2.avatarUrl,
      partner_id: newChatRoom.user2._id,
      num_unwatch: newChatRoom.num_unwatched_1,
      lastMessage: newChatRoom.lastMessage,
    };

    if (finalChatRoom.lastMessage == undefined) {
      finalChatRoom.lastMessage = {
        message: "Hộp thoại trống",
        type: "isText",
        createdAt: new Date().toISOString(),
      };
    }

    res.status(200).json(finalChatRoom);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
