const { getUser } = require("../function/socket.function.js");
const { getSocketId } = require("../data/socket_id.data.js");
const {
  getIsCalling,
  updateIsCalling,
} = require("../data/calling_audio/is_calling.data.js");
const {
  getClientPeerId,
  updateClientPeerId,
  printClientPeerIds,
} = require("../data/calling_audio/client_peerId.data.js");

exports.calling_audio_feature_init = async (client, current_user_id) => {
  await updateIsCalling(current_user_id, false);

  client.on("calling", async (data) => {
    try {
      console.log(data);
      let partner_id = data["partner_id"];
      let call_type = data["call_type"];
      console.log("partner_id :", partner_id);

      let partner_socket_id = await getSocketId(partner_id);

      let current_user = await getUser(current_user_id);
      let partner = await getUser(partner_id);

      console.log(await getIsCalling(current_user_id));
      console.log(await getIsCalling(partner_id));
      console.log(await getClientPeerId(current_user_id));
      console.log(await getClientPeerId(partner_id));
      printClientPeerIds();
      if (
        !((await getIsCalling(current_user_id)) == undefined) &&
        !((await getClientPeerId(current_user_id)) == undefined)
      ) {
        updateIsCalling(current_user_id, true);
        console.log("open_calling_ui");
        client.emit("open_calling_ui", {
          is_caller: true,
          partner_id: partner_id,
          partner_name: partner.first_name,
          partner_avatar: partner.avatarUrl,
          call_type: call_type,
        });
      }

      if (
        !((await getIsCalling(partner_id)) == undefined) &&
        !((await getClientPeerId(partner_id)) == undefined) &&
        (await getIsCalling(partner_id)) == false
      ) {
        updateIsCalling(partner_id, true);
        console.log("open_calling_ui");
        client.to(partner_socket_id).emit("open_calling_ui", {
          is_caller: false,
          partner_id: current_user_id,
          partner_name: current_user.first_name,
          partner_avatar: current_user.avatarUrl,
          call_type: call_type,
        });
      }

      console.log("calling");
    } catch (error) {
      console.log("calling_audio_feature_init -> calling -> error");
      console.log(error);
    }
  });

  client.on("acctepted_calling", async (data) => {
    console.log("acctepted_calling");
    let partner_id = data["partner_id"];
    let partner_socket_id = await getSocketId(partner_id);
    if (
      !((await getClientPeerId(current_user_id)) == undefined) &&
      !((await getClientPeerId(partner_id)) == undefined)
    ) {
      client.emit("acctepted_calling_ui", {
        partner_peer_id: await getClientPeerId(partner_id),
      });
      client.to(partner_socket_id).emit("acctepted_calling_ui", {
        partner_peer_id: await getClientPeerId(current_user_id),
      });
    }
  });

  client.on("init_peer_id", (data) => {
    console.log("init_peer_id");
    let peer_id = data.peer_id;
    updateClientPeerId(current_user_id, peer_id);
  });

  client.on("stop_calling", async (data) => {
    let partner_id = data["partner_id"];
    let partner_socket_id = await getSocketId(partner_id);
    console.log("stop");
    updateIsCalling(current_user_id, false);

    if ((await getIsCalling(partner_id)) == true) {
      updateIsCalling(partner_id, false);
      client.to(partner_socket_id).emit("stop_calling", {});
    }
  });
};
