import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./config/socket.js";

dotenv.config();

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

app.use((req, res, next) => {
   res.setHeader(
      "Access-Control-Allow-Origin",
      "https://chatty-lovat-five.vercel.app"
   );
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
   next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
   res.json({ message: "Server running successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
   connectDB();
   console.log("Server running at port:", PORT);
});
