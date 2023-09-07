let socketIds = {};

const getSocketId = async (uid = "") => {
  return socketIds[uid];
};

const updateSocketId = async (uid = "", socket_id) => {
  try {
    socketIds[uid] = socket_id;
    console.log(socketIds);
  } catch (error) {
    console.log("updateSocketId error");
    console.log(error);
  }
};

const count_num_clients_online = async () => {
  try {
    return Object.keys(socketIds).length;
  } catch (error) {
    console.log("count_num_clients_online error");
    console.log(error);
  }
};

module.exports = {
  count_num_clients_online,
  getSocketId,
  updateSocketId,
};
