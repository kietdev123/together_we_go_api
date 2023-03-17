require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todo.js")
const authRoutes = require("./routes/auth.js")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get("/",(req, res) => {
    res.send("hello world");
});

app.use("/api/todos", todoRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;