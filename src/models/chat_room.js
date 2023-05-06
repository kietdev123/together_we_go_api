const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  userId_1: { type: mongoose.Schema.Types.ObjectId, required: true },
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  userId_2: { type: mongoose.Schema.Types.ObjectId, required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  num_unwatched_1: {
    type: Number,
    default: 0,
  },
  num_unwatched_2: {
    type: Number,
    default: 0,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "message",
  },
});

module.exports = mongoose.model("chat_room", chatRoomSchema);
