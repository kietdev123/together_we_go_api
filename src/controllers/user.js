const User = require("../models/user");

exports.editAvatar = async (req, res, next) => {
  try {
    var userId = req.params.userId;

    var user = User.findById(userId);

    user.avatarUrl = req.body.avatarUrl;

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
