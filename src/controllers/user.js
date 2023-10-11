const User = require("../models/user");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const message_name = "user";

// exports.create = async (req, res, next) => {
//   try {
//     let data = await User.findById(req.user.user_id)
    
//     return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
//   } catch (e) {
//     console.log(e);
//     return sendServerError(res);
//   }
// };

exports.getOne = async (req, res, next) => {
  try {
    let data = await User.findById(req.params.id)
    
    return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.getList = async (req, res, next) => {
  try {
    let filter = {};
    let {page, pageSize, sortCreatedAt, sortUpdatedAt, keyword} = req.query;
    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;

    if (keyword) {
        filter = {
          $or: [
            {
              first_name : {$regex: keyword}
            },
            {
              last_name : {$regex: keyword}
            },
            {
              email : {$regex: keyword}
            }
          ]
        }
    }

    let _sort = {};
    if (sortCreatedAt) _sort.createdAt = Number(sortCreatedAt);
    if (sortUpdatedAt) _sort.updatedAt = Number(sortUpdatedAt);

    const datas = await User
    .find(filter)
    .sort(_sort)
    .skip(skipNum)
    .limit(pageSize)
    
    return sendSuccess(res,`Get ${message_name} succesfully`, datas, datas.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};


exports.update = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {new : true})
 
    return sendSuccess(res, `Update 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await User.findByIdAndRemove(req.params.id);
 
    return sendSuccess(res, `Delete 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getInfo = async (req, res, next) => {
  try {
    let data = await User.findById(req.user.user_id)
    
    return sendSuccess(res, `Get 1 ${message_name} successfully`, data);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.updateInfo = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.user.user_id, req.body, {new : true})
 
    return sendSuccess(res, `Update 1 ${message_name} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

