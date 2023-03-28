const User = require("../models/user");

exports.editAvatar = async (req, res, next) => {
  try {
    var userId = req.params.userId;
    console.log(userId);
    var user = await User.findById(userId);

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
