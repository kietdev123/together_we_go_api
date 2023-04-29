const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  userId_1: { type: mongoose.Schema.Types.ObjectId, required: true },
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  userId_2: { type: mongoose.Schema.Types.ObjectId, required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("chat_room", chatRoomSchema);
