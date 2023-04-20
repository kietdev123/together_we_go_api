const User = require("../../models/user");
const Message = require("../../models/message");

const userConnected = async (uid = "", socket_id) => {
  const user = await User.findById(uid);
  user.online = true;
  user.time = new Date();
  await user.save();
  return user;
};

const userDisconnected = async (uid = "") => {
  const user = await User.findById(uid);
  user.online = false;
  user.time = new Date();
  await user.save();
  return user;
};

const getUser = async (uid = "") => {
  const user = await User.findById(uid);
  return user;
};

const saveMessage = async (payload) => {
  try {
    const message = Message({
      chatRoomId: payload.chatRoomId,
      userId: payload.userId,
      message: payload.message,
      type: payload.type,
    });
    await message.save();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  userConnected,
  userDisconnected,
  saveMessage,
  getUser,
};
