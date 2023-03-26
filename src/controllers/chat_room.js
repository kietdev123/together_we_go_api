const ChatRoom = require("../models/chat_room");

exports.createChatRoom = (req, res, next) => {
    const chat_room = new ChatRoom({
        userId_1 : req.body.userId_1,
        userId_2 : req.body.userId_2,
    })
    chat_room
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Chat room added succesfully",
                post: {
                    ...result,
                    id: result._id,
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Fail to create chat room!",
            });
        });
};