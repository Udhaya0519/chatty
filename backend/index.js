import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./config/socket.js";

import path from 'path'

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: [
         "https://chatty-lovat-five.vercel.app",
         "https://chatty-udhaya-js-projects.vercel.app",
         "https://chatty-git-main-udhaya-js-projects.vercel.app",
      ],
      credentials: true,
   })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


if(process.env.NODE_ENV === "production"){
   app.use(express.static(path.join(__dirname, "../frontend/dist")))

   app.get("*", (req,res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
   })
}

server.listen(PORT, () => {
   console.log("Server running at port:", PORT);
   connectDB();
});
