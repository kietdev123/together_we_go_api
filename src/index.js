const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todo.js")

main()
    .then((res) => console.log(res))
    .catch((res) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/test")
    console.log("Connect to mongodb successfully")
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get("/",(req, res) => {
    res.send("hello world");
});

app.use("/api/todos", todoRoutes);

app.listen(8080,() => {
    console.log("listening on port 8080");
})