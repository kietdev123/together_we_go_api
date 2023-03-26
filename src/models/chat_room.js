const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
    userId_1: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId_2: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("chat_room", chatRoomSchema);