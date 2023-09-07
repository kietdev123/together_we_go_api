const mongoose = require("mongoose");
const { MESSAGE_TYPE } = require("../contrants.js");

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: { type: mongoose.Schema.Types.ObjectId, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
        type: { type: String, required: true, enum: MESSAGE_TYPE },
    },
    { timestamps: true, }
);

module.exports = mongoose.model("message", messageSchema);