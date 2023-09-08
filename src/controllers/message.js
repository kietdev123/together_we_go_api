const Message = require("../models/message");
const ChatRoom = require("../models/chat_room");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");

exports.getMessageChatRoom = async (req, res, next) => {
    try {
        const data = await Message.find({
          chatRoomId :  req.params.chatRoomId
       })
  
        // res.status(200).json({
        //   success: true,
        //   message: data,
        // });
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}