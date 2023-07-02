// import environment variable
require("dotenv").config();

// import database
require("./config/database").connect();


const express = require("express");
const bodyParser = require("body-parser");

// import routes
const todoRoutes = require("./routes/todo.js");
const authRoutes = require("./routes/auth.js");
const uploadRoutes = require("./routes/upload.js");
const chatRoomRoutes = require("./routes/chat_room.js");
const messageRoutes = require("./routes/message.js");
const userRoutes = require("./routes/user.js");
const bookingRoutes = require("./routes/booking.js");
const applyRoutes = require("./routes/apply.js");
const reviewRoutes = require("./routes/review.js");

const app = express();

// import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/index.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat_room", chatRoomRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/review", reviewRoutes);
module.exports = app;
