let users = {};
// {
//     'userId' : {
//         'isOnline' : 'bool',
//         'name' : 'string',
//         'socket_id' : 'string',
//     }
// }

exports.get = async (uid = "") => {
  return socketIds[uid];
};

exports.updateSocket = async (uid = "", socket_id) => {
  try {
    users[uid].socket_id = socket_id;
  } catch (error) {
    console.log("user updateSocket error");
    console.log(error);
  }
};

exports.updateName = async (uid = "", name) => {
    try {
      users[uid].name = name;
    } catch (error) {
      console.log("user update name error");
      console.log(error);
    }
};

exports.updatIsOnline = async (uid = "", isOnline) => {
    try {
      users[uid].isOnline = isOnline;
    } catch (error) {
      console.log("user update isOnline error");
      console.log(error);
    }
};
