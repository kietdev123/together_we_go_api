let socketIds = {};
// {
//     'socket_id' : 'userId'
// }

exports.get = async (socket_id = "") => {
  return socketIds[socket_id];
};

exports.update = async (socket_id, uid) => {
  try {
    socketIds[socket] = uid;
    console.log(socketIds);
  } catch (error) {
    console.log("updateSocketId error");
    console.log(error);
  }
};

