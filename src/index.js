const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Connect socket (with cors, for web app)
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
exports.io = io;
require("./sockets/socket");
require("./sockets/features/chat.feature");
require("./controllers/message");

