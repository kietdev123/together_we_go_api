exports.chat_feature_init = (client) => {
  client.on("join_chat_room", (data) => {
    console.log("join chat room");
    let chat_room_id = data["chat_room_id"];
    client.join(chat_room_id);
  });

  client.on("leave_chat_room", (data) => {
    console.log("leave chat room");
    let chat_room_id = data["chat_room_id"];
    client.leave(chat_room_id);
  });
};
