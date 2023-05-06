const { saveMessage } = require("../function/socket.function.js");
const { getSocketId } = require("../data/socket_id.data.js");
const {
  _chatRoom_updateNumUnWatch,
  _chatRoom_resetNumUnWatch,
} = require("../function/chat_room.function.js");
var numClients = {};

exports.chat_feature_init = (client, current_user_id, io) => {
  client.on("join_chat_room", (data) => {
    console.log("join chat room");
    var chat_room_id = data["chat_room_id"];
    client.join("chat_room" + chat_room_id);

    var chatID = "chat_room" + chat_room_id;
    if (numClients[chatID] == undefined) {
      numClients[chatID] = 1;
    } else {
      numClients[chatID]++;
    }

    _chatRoom_resetNumUnWatch(chat_room_id, current_user_id);
  });

  client.on("leave_chat_room", (data) => {
    console.log("leave chat room");
    var chat_room_id = data["chat_room_id"];
    client.leave("chat_room" + chat_room_id);

    var chatID = "chat_room" + chat_room_id;
    if (numClients[chatID] != undefined && numClients[chatID] > 0) {
      numClients[chatID]--;
    }
  });

  client.on("send_message_to_chat_room", async (data) => {
    var chat_room_id = data["chat_room_id"];
    var partner_id = data["partner_id"];

    console.log(data);
    var message = {
      chatRoomId: data["chat_room_id"],
      userId: data["userId"],
      message: data["message"],
      type: data["type"],
      createdAt: data["createdAt"],
    };

    saveMessage(message);

    var chatID = "chat_room" + chat_room_id;
    var usersInRoom = numClients[chatID];

    console.log("message num ", usersInRoom || 0);
    if (usersInRoom == undefined) {
      usersInRoom = 0;
    }

    if (usersInRoom == 1) {
      await _chatRoom_updateNumUnWatch(chat_room_id, partner_id);
      client.in(await getSocketId(partner_id)).emit("reload_chatRooms");
    } else {
      client
        .in("chat_room" + chat_room_id)
        .emit("receive_message_from_chat_room", message);
    }
  });
};
