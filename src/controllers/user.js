const User = require("../models/user");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const message_name = "user";

exports.get = async (req, res, next) => {
  try {
    let data = await User.findById(req.user.user_id)
    
    return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.user.user_id, req.body, {new : true})
 
    return sendSuccess(res, `Update 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

