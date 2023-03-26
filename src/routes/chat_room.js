const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers/chat_room");

router.post("", chatRoomController.createChatRoom);

module.exports = router;