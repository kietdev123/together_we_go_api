const { chat_feature_init } = require("./features/chat.feature.js");
const { calling_feature_init } = require("./features/calling.feature.js");
const UserData = require('./data/user.js');
const SocketIdData = require('./data/socket_id.data.js');
const { userConnected, userDisconnected } = require("./function/socket.function.js");
const ChatRoom = require('../models/chat_room.js');
const Notification = require("../models/notification.js");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const config = process.env;

let io;
exports.socketConnection = (server) => {
  io = require('socket.io')(server);
  io.on("connection", async (client) => {
    console.log(`Client connected!`);
    // init feature here
    chat_feature_init(client, io);
    calling_feature_init(client, io);
    const token = client.handshake.query.token;
    
    const decoded = jwt.verify(token, 'SADASDADASMDAS213012123smsdsiiJiNiIInNN.23l23');
    const userId = decoded.user_id; // req.user = { user_id: '',  role : '' }
    UserData.updateSocket(userId, client.id);
    SocketIdData.update(client.id, decoded.email);

    client.on("update", async (data) => {
      console.log(`Client update!`);
      const { user_id, socket_id, user_name  } = data; 
 
      
      UserData.updateName(user_id, user_name);
      UserDate.updateIsOnline(user_id, true);
      userConnected(user_id); 
    });

    client.on("disconnect", async (data) => {
       console.log(`Client disconnect!`);
      // const { user_id, socket_id, user_name  } = data;
      // UserData.updateSocket(user_id, '');
      // UserData.updateIsOnline(user_id, false);

      // await userDisconnected(user_id);
    });

    
    // when we get a call to start a call
    client.on('start-call', async ({ to, callerName, callerId, callerAvatar })=> {
     
      const socketId = await SocketIdData.get(to);
      console.log("initiating call request to ", to , ' ', socketId);
      io.to(socketId).emit("incoming-call", { 
        from: to, 'callerName' : callerName, 'callerId' : callerId,
        'callerAvatar' : callerAvatar,
      })
    })

    // when an incoming call is accepted
    client.on("accept-call", async ({ to })=> {
        const socketId = await SocketIdData.get(to);
        console.log("call accepted by ", " from ", to, ' ', socketId);

        io.to(socketId).emit("call-accepted", { to })
    })
    
    // when an incoming call is denied
    client.on("deny-call", async ({ to })=> {
        const socketId = await SocketIdData.get(to);
        console.log("call denied by "," from ", to, ' ', socketId);

        io.to(socketId).emit("call-denied", { to })
    })
    
    // when a party leaves the call
    client.on("leave-call",async  ({ to })=> {
        const socketId = await SocketIdData.get(to);
        console.log("left call mesg by  from ", to, ' ', socketId);
  
        io.to(socketId).emit("left-call", { to })
    })

    // when an incoming call is accepted,..
    // caller sends their webrtc offer
    client.on("offer", async ({ to, offer })=> {
        const socketId = await SocketIdData.get(to);
        console.log("offer from  to ", to, ' ', socketId);

        io.to(socketId).emit("offer", { to, offer })
    })

    // when an offer is received,..
    // receiver sends a webrtc offer-answer
    client.on("offer-answer",async  ({ to, answer })=> {
        const socketId = await SocketIdData.get(to);
        console.log("offer answer from  to ", to, ' ', socketId);
        io.to(socketId).emit("offer-answer", { to, answer })
    })
    

    // when an ice candidate is sent
    client.on("ice-candidate",async ({ to, candidate })=> {
        const socketId = await SocketIdData.get(to);
        console.log("ice candidate from to ", to, ' ', socketId);
   
        io.to(socketId).emit("ice-candidate", { to, candidate })
    })
});
};

exports.sendEvent = async (userId, eventName, data) => {
    try {
      const receiver_socket_id = await UserData.getSocket(userId);
      console.log('socket id', userId, ' ',  receiver_socket_id);
      if (receiver_socket_id != null && receiver_socket_id != undefined){
          io.to(receiver_socket_id).emit(
            eventName, 
            data
          );
      }
  
    } catch (error) {
      console.log(error);
    }
  };


  exports.sendMessage = async (message) => { 
    try {
      // const io = require('../../../index.js');
      //  console.log('2',io);
  
      // console.log(message);
      console.log(io.sockets.adapter.rooms);
      
      //  let sockets = await io.in(message["chatRoomId"]).fetchSockets();
     let usersInRoom = io.sockets.adapter.rooms.get(message["chatRoomId"].toString()).size;
      // let usersInRoom = sockets.size;
      // console.log(sockets);
      if (usersInRoom == 1) {   
        const chatRoom = await ChatRoom.findById(message["chatRoomId"]);
        let receiver_id;
        if (chatRoom.userId1 == message.userId.id) {
          receiver_id = chatRoom.userId2;
          chatRoom.numUnwatched2++;
        }
        else {
          receiver_id = chatRoom.userId1;
          chatRoom.numUnwatched1++;
        }
        await chatRoom.save();
     
        const receiver_socket_id = await UserData.getSocket(receiver_id);
  
        console.log(receiver_id, ' ', receiver_socket_id);
        if (receiver_socket_id != null && receiver_socket_id != undefined){
                // const _name = await UserData.get(message.userId).name;
  
          await Notification.create({
            receiver: new mongoose.Types.ObjectId(receiver_id),
            author: new mongoose.Types.ObjectId(message.userId.id),
            text: "Đã gửi 1 tin nhắn mới",
          });
  
          console.log('send notification chat');
            io.to(receiver_socket_id).emit(
              "receive_notification", 
              {
                notification_body: "Đã nhận 1 tin nhắn mới",
                notification_name_screen: "chat_screen",
              }
            );
  
            io.to(receiver_socket_id).emit("reload_chat_room", {});
        }
  
      }
      const roomId = message["chatRoomId"];
      const receiver_socket_id = await UserData.getSocket(message["userId"]["id"]);
      // io.to(receiver_socket_id).emit(
      //   "receive_message",
      //   message
      // );
      io.in(roomId.toString()).emit(
        "receive_message",
        message
      );
    } catch (error) {
      console.log(error);
    }
  }
