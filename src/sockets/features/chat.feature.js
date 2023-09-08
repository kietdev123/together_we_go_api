const {io} = require('../../index.js');
const chat_room = require('../../models/chat_room');
const UserData = require('../data/user.js');

exports.chat_feature_init = (client) => {
  client.on("join_chat_room", (data) => {
    try {
      console.log("join chat room");
      let chat_room_id = data["chat_room_id"];
      client.join(chat_room_id);
    } catch (error) {
      console.log(error);
    }
  });

  client.on("leave_chat_room", (data) => {
    try {
      console.log("leave chat room");
      let chat_room_id = data["chat_room_id"];
      client.leave(chat_room_id);
    } catch (error) {
      console.log(error);
    }
  });
};

exports.sendMessage = async (message) => { 
  try {
    let sockets = await io.in(message["chatRoomId"]).fetchSockets();
    let usersInRoom = sockets.length;

    if (usersInRoom == 1) {   
      const chatRoom = await chat_room.findById(message["chatRoomId"]).lean();
      let receiver_id;
      if (chatRoom.userId_1 == message.userId) receiver_id = chatRoom.userId_2;
      else receiver_id = chatRoom.userId_1;
      const receiver_socket_id = await UserData.get(receiver_id).socket_id;
      const _name = await UserData.get(message.userId).name;
      
      io.to(receiver_socket_id).emit(
        "receive_notification", 
        {
          notification_body: _name + " đã gửi bạn 1 tin nhắn",
          notification_name_screen: "chat_screen",
        }
      );
    }
    io.in(message["chatRoomId"]).emit(
      "receive_message",
      message
    ); 
  } catch (error) {
    console.log(error);
  }
}
