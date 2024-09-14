require("dotenv/config");

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

mongoose
  .connect(process.env.MONGODB_URL_LOCAL, {
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join conversation room based on conversationId
  socket.on("join room", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

  // Handle sending messages
  socket.on("chat message", (data) => {
    const { conversationId, message, senderId } = data;
    console.log("Message received:", data);

    // Emit message to all users in the conversation room
    io.to(conversationId).emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
