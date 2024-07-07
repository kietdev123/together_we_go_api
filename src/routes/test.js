const express = require("express");
const router = express.Router();
const { sendEvent } = require("../sockets/socket.js");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");

router.post("/send-noti",  async (req, res, next) => {
    try {
    
      sendEvent(req.body.userId,"receive_notification",{
        notification_body: 'ok',
        notification_name_screen: "chat_screen",
      });
  
      return sendSuccess(res, `Send noti successs`, {});
  
    } catch (error) {
      console.log(error);
      return sendServerError(res);
    }
  });


module.exports = router;