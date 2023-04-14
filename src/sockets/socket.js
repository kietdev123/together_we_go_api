const {
  userConnected,
  userDisconnected,
} = require("./function/socket.function.js");
const { chat_feature_init } = require("./features/chat.feature.js");
const {
  calling_audio_feature_init,
} = require("./features/calling_audio.feature.js");
const { io } = require("../index");

io.on("connection", async (client) => {
  console.log(`Client connected!`);
  console.log(client.id);
  let user_id = client.handshake.query.user_id;
  console.log(user_id);
  // init feature here
  chat_feature_init(client, user_id, io);
  calling_audio_feature_init(client, user_id);
  //
  await userConnected(user_id, client.id);
  client.on("disconnect", async () => {
    console.log(`Client disconnect!`);
    await userDisconnected(user_id);
  });
});
