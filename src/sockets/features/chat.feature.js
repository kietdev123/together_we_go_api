
const chat_room = require('../../models/chat_room');
const UserData = require('../data/user');
const Notification = require('../../models/notification');
const mongoose = require("mongoose");

exports.chat_feature_init = (client) => {

  client.on("join_chat_room", (data) => {
    try {
      console.log("join chat room ", data["chat_room_id"]);
      let chat_room_id = data["chat_room_id"];
      client.join(chat_room_id);
    } catch (error) {
      console.log(error);
    }
  });

  client.on("leave_chat_room", (data) => {
    try {
      console.log("leave chat room ,",data["chat_room_id"]);
      let chat_room_id = data["chat_room_id"];
      client.leave(chat_room_id);
    } catch (error) {
      console.log(error);
    }
  });
};


