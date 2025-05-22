import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./config/socket.js";

dotenv.config();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

await connectDB();

if (process.env.NODE_ENV !== "production") {
   const PORT = process.env.PORT || 3000;

   server.listen(PORT, () => {
      console.log("Server running at port:", PORT);
   });
}

//export server for vercel

export default server;
