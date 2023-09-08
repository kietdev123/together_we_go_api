const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        // notifcation is describe author's action, and sent to receiver
        text: {
          type: String,
          required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
