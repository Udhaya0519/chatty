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

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
   res.json({ message: "Server running successfully" });
});

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

export default server
