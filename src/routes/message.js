const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");

router.post("/:chatRoomId", messageController.getMessageChatRoom);

module.exports = router;