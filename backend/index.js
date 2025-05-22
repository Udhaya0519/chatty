import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { Server } from "socket.io";
import { app, server } from "./config/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
   cors: { origin: "*" },
});

export const getReceiverSocketId = (userId) => {
   return userSocketMap[userId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
   const userId = socket.handshake.query.userId;
   if (userId) userSocketMap[userId] = socket.id;

   io.emit("getOnlineUsers", Object.keys(userSocketMap));

   socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
   });
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

await connectDB();

// if (process.env.NODE_ENV !== "production") {
//    const PORT = process.env.PORT || 3000;

//    server.listen(PORT, () => {
//       console.log("Server running at port:", PORT);
//    });
// }

//export server for vercel

export default server;
