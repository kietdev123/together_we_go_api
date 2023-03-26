const { 
    //userConnected, userDisconnected, 
    saveMessage,
} = require('../controllers/socket');
//const { verifyJWT } = require('../helpers/jwt');
const{io} = require('../index');

// sockets messages
io.on('connection', client => {
    console.log(`Client connected!`);

    client.on("join_chat_room", (data) => {
        console.log('join chat room');
        var chat_room_id = data["chat_room_id"];
        client.join("chat_room"+chat_room_id);      
    });

    client.on("leave_chat_room", (data) => {
        console.log('leave chat room');
        var chat_room_id = data["chat_room_id"];
        client.leave("chat_room"+chat_room_id);      
    });
    
    client.on("send_message_to_chat_room", (data) => {
        var chat_room_id = data["chat_room_id"];
        console.log(data);
        var message = {
            chatRoomId: data["chat_room_id"],
            userId: data["userId"],
            message: data["message"],
            type: data["type"],
            createdAt: data["createdAt"],
        };

        saveMessage(message);

        client.in("chat_room"+chat_room_id).emit("receive_message_from_chat_room", 
          message
        );
    });
    
});