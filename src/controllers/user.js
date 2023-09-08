const User = require("../models/user");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");

exports.editAvatar = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let user = await User.findById(userId);

    console.log(user);

    user.avatarUrl = req.body.avatar_url;

    await user.save();
    res.status(200).json({
      message: "Avatar updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Fail to edit avatar url",
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let user = await User.findById(userId);

    let name = user.first_name;
    let gender = user.gender;
    let birth_date;
    if (user.birth_date == undefined) {
      birth_date = "";
    } else {
      birth_date = user.birth_date;
    }
    res.status(200).json({
      message: "pass",
      name: name,
      gender: gender,
      birth_date: birth_date,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let user = await User.findById(userId);
    console.log(req.body);
    user.first_name = req.body.name;
    user.gender = req.body.gender;
    user.birth_date = req.body.birth_date;

    await user.save();
    res.status(200).json({
      message: "pass",
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
    });
  }
};

exports.updateUserLocation = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let user = await User.findById(userId);
    console.log(req.body);
    user.location_id = req.body.location_id;
    user.location_mainText = req.body.location_mainText;
    user.location_address = req.body.location_address;
    await user.save();
    res.status(200).json({
      message: "pass",
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
    });
  }
};
