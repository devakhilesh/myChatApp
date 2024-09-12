require("dotenv/config");

const mongoose = require("mongoose");
const http = require("http"); // Import the http module
const { Server } = require("socket.io"); // Import socket.io
const app = require("./app");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL_LOCAL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err.message));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:"*",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("chat message", (data) => {
    console.log("Message received:", data);

    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
