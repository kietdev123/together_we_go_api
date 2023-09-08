const { chat_feature_init } = require("./features/chat.feature.js");
const { calling_feature_init } = require("./features/calling.feature.js");
const { io } = require("../index");
const UserData = require('./data/user.js');
const SocketIdData = require('./data/socket_id.data.js');
const { userConnected, userDisconnected } = require("./function/socket.function.js");

io.on("connection", async (client) => {
    console.log(`Client connected!`);

    // init feature here
    chat_feature_init(client);
    calling_feature_init(client);

    client.on("update", async (data) => {
      console.log(`Client update!`);
      const { user_id, socket_id, user_name  } = data; 
      SocketIdData.update(socket_id, user_id);
      UserData.updateSocket(user_id, socket_id);
      UserData.updateName(user_id, user_name);
      UserDate.updateIsOnline(user_id, true);
      userConnected(user_id); 
    });

    client.on("disconnect", async (data) => {
      console.log(`Client disconnect!`);
      const { user_id, socket_id, user_name  } = data;
      UserData.updateSocket(user_id, '');
      UserDate.updateIsOnline(user_id, false);

      await userDisconnected(user_id);
    });
});
