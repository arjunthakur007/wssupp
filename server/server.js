// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import http from "http";
// import connectDB from "./configs/db.js";
// import connectCloudinary from "./configs/cloudinary.js";
// import userRouter from "./routes/userRoutes.js";
// import cookieParser from "cookie-parser";
// import messageRouter from "./routes/messagesRoutes.js";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);

// const allowedOrigins = [
//   "http://localhost:51734",
//   "https://quickchat-beige.vercel.app",
// ];

// //Socket.io server initialize
// export const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });
// //Store online users
// export const userSocketMap = {}; //{ userId: socketId }

// //Socket.io connection handler
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);

//   if (userId) userSocketMap[userId] = socket.id;

//   //Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", userId);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// //Middleware configuration
// app.use(express.json({ limit: "4mb" }));
// app.use(cookieParser());
// app.use(cors({ origin: allowedOrigins, credentials: true }));

// await connectDB();
// await connectCloudinary();

// app.get("/", (req, res) => res.send("API is Working"));

// app.use("/api/user", userRouter);
// app.use("/api/messages", messageRouter);

// if (process.env.NODE_ENV !== "production") {
//   const port = process.env.PORT || 5000;
//   server.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
// }

// //Export server for vercel
// export default server;




import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messagesRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Allowed origins (fallback to all for safety in dev)
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://quickchat-beige.vercel.app"]
    : ["http://localhost:5173"];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow no-origin (e.g. curl, mobile)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked by CORS: ${origin}`);
    return callback(null, false); // don't crash, just reject
  },
  credentials: true,
};

// Apply CORS globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// Socket.io with same CORS
export const io = new Server(server, { cors: corsOptions });
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

// Start server + connect DB/Cloudinary
async function startServer() {
  try {
    await connectDB();
    await connectCloudinary();

    if (process.env.NODE_ENV !== "production") {
      const port = process.env.PORT || 5000;
      server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();

export default server; // for Vercel
