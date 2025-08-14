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
import { log } from "console";

const app = express();
const server = http.createServer(app);

//Socket.io server initialize
export const io = new Server(server, {
  cors: { origin: "*" },
});

//Store online users
export const userSocketMap = {}; //{ userId: socketId }

//Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Allow multiple origins
const allowedOrigins = ["http://localhost:5173"];

//Middleware configuration
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

const port = process.env.PORT || 5000;

await connectDB();
await connectCloudinary();

app.get("/", (req, res) => res.send("API is Working"));

app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
