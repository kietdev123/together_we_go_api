var is_Callings = {};

const getIsCalling = async (uid = "") => {
  return is_Callings[uid];
};

const updateIsCalling = async (uid = "", value) => {
  try {
    is_Callings[uid] = value;
    console.log(is_Callings);
  } catch (error) {
    console.log("updateIsCalling error");
    console.log(error);
  }
};

module.exports = {
  getIsCalling,
  updateIsCalling,
};
