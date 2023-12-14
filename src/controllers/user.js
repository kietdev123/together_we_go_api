const User = require("../models/user");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const dataName = "user";

exports.getOne = async (req, res, next) => {
  try {
    let data = await User.findById(req.params.id)
    
    return sendSuccess(res, `Get 1 ${dataName} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {new : true})
    return sendSuccess(res, `Update 1 ${dataName} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getInfo = async (req, res, next) => {
  try {
    let data = await User.findById(req.user.user_id)
    
    return sendSuccess(res, `Get 1 ${dataName} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.updateInfo = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.user.user_id, req.body, {new : true})
 
    return sendSuccess(res, `Update 1 ${dataName} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

