const ChatRoom = require("../../models/chat_room");

const _chatRoom_updateNumUnWatch = async (chatRoomId, partner_id) => {
  let chatRoom = await ChatRoom.findById(chatRoomId);
  if (chatRoom.userId_1 == partner_id) {
    chatRoom.num_unwatched_1++;
  } else {
    chatRoom.num_unwatched_2++;
  }
  await chatRoom.save();
};

const _chatRoom_resetNumUnWatch = async (chatRoomId, current_user_id) => {
  let chatRoom = await ChatRoom.findById(chatRoomId);
  if (chatRoom.userId_1 == current_user_id) {
    chatRoom.num_unwatched_1 = 0;
  } else {
    chatRoom.num_unwatched_2 = 0;
  }
  await chatRoom.save();
};

module.exports = {
  _chatRoom_updateNumUnWatch,
  _chatRoom_resetNumUnWatch,
};
