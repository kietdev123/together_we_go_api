const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  avatarUrl: {
    type: String,
    default:
      "https://asset.cloudinary.com/dxoblxypq/8784fb5ee7e064f8dd5831894418141a",
    // default link save in cloudinary
  },
});

module.exports = mongoose.model("user", userSchema);
