const { getUser } = require("../function/socket.function.js");

exports.calling_audio_feature_init = (client, current_user_id) => {
  client.on("calling", async (data) => {
    console.log(data);
    var parner_id = data["partner_id"];
    console.log("partner_id :", parner_id);
    var user = await getUser(parner_id);
    console.log("user :", user);
    client.to(user.socket_id).emit("get_calling", () => {});
    console.log("calling");
  });
};
