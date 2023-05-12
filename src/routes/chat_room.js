const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers/chat_room");

router.post("", chatRoomController.createChatRoom);

router.get("/:userId", chatRoomController.getAllChatRoomWithUserId);
router.get("/getOne/:chatRoomId", chatRoomController.getOne);
router.get(
  "/getChatRoomInBooking/:posterId/:current_user_id",
  chatRoomController.getChatRoomInBooking
);
module.exports = router;
