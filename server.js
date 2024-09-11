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

// Create HTTP server with the Express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:"*",
  },
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for chat message events
  socket.on("chat message", (data) => {
    console.log("Message received:", data);

    // Emit message to all connected clients
    io.emit("chat message", data);
  });

  // Handle user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Set the port to 3001
const port = process.env.PORT || 3001;

// Start the server on port 3001
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
