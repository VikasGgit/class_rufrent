// /**
//  * Main application file.
//  * This file initializes the Express application, sets up middleware, and loads routes.
//  */

// const express = require('express'); // Importing the Express framework
// const bodyParser = require('body-parser'); // Middleware for parsing request bodies
// const tablesRoutes = require('./routes/tablesRoutes'); // Importing routes for table operations
// const signupLoginRoutes = require('./routes/signupLoginRoutes'); // Importing routes for signup and login
// const adminRoutes=require('./routes/adminRoutes');
// const paymentRoutes = require('./routes/paymentRoutes'); // Importing routes for user operations
// const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing (CORS)

// const app = express(); // Creating an Express application instance

// // Middleware to parse JSON request bodies
// app.use(bodyParser.json()); // Automatically parses incoming JSON payloads and makes them available in req.body



// // Middleware to enable CORS
// app.use(cors()); // Allows requests from different origins, enabling cross-origin resource sharing

// // Route handler for table-related operations
// app.use('/api', tablesRoutes); // Routes starting with /api are handled by tablesRoutes

// // Route handler for signup and login operations
// app.use('/api', signupLoginRoutes); // Routes starting with /api are handled by signupLoginRoutes

// app.use('/api',adminRoutes);

// app.use('/api/payments',paymentRoutes);

// // Start the server
// const PORT = 5000; // Define the port number the server will listen on
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`); // Logs a message to indicate the server is running
// });


/**
 * Main application file.
 * This file initializes the Express application, sets up middleware, and loads routes.
 */

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const tablesRoutes = require("./routes/tablesRoutes");
const signupLoginRoutes = require("./routes/signupLoginRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const NotificationService = require("./utils/notificationService");
const sendScheduledNotifications = require("./utils/cronjob");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const notificationService = new NotificationService();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Store online users in a Map: { userId: socketId }
const onlineUsers = new Map();

// Initialize the `/notifications` namespace
const notificationNamespace = io.of("/notifications");

notificationNamespace.on("connection", (socket) => {
  console.log(`User connected to /notifications with socket ID: ${socket.id}`);

  socket.on("joinNotifications", async (userId) => {
    if (userId) {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined notification room with socket ID ${socket.id}`);

      // Fetch and emit unread notifications
      const notifications = await notificationService.getUserNotifications(userId);
      console.log("User notifications", notifications);
      socket.emit("receiveNotification", Array.isArray(notifications) ? notifications : [notifications]);
    }
  });

  socket.on("disconnect", () => {
    const disconnectedUser = [...onlineUsers.entries()].find(([key, value]) => value === socket.id);
    if (disconnectedUser) {
      onlineUsers.delete(disconnectedUser[0]);
      console.log(`User ${disconnectedUser[0]} disconnected.`);
    }
  });
});

// Start scheduled notifications
sendScheduledNotifications(io, onlineUsers);

// Routes
app.use("/api", tablesRoutes);
app.use("/api", signupLoginRoutes);
app.use("/api", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/noti", notificationRoutes(io, onlineUsers));

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
