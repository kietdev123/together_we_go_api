var client_peerIds = {};

const getClientPeerId = async (uid = "") => {
  return client_peerIds[uid];
};

const updateClientPeerId = async (uid = "", peer_id) => {
  try {
    client_peerIds[uid] = peer_id;
    console.log("peer_ids");
    console.log(client_peerIds);
  } catch (error) {
    console.log("updateClientPeerId error");
    console.log(error);
  }
};

const printClientPeerIds = async () => {
  try {
    console.log("peer_ids");
    console.log(client_peerIds);
  } catch (error) {
    console.log("printClientPeerIds error");
    console.log(error);
  }
};

module.exports = {
  getClientPeerId,
  updateClientPeerId,
  printClientPeerIds,
};
