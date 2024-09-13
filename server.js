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
    methods: ["GET", "POST"], 
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("chat message", (data) => {
    console.log("Message received:", data);

    io.emit("chat message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  req.io = io; // Attach io instance to request object
  next();
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
