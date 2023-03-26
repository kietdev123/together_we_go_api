const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: { type: mongoose.Schema.Types.ObjectId, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
        type: { type: String, required: true },
    },
    { timestamps: true, }
);

module.exports = mongoose.model("message", messageSchema);