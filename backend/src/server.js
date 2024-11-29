import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import path from 'path'

import connectDB from '../db/db.js'

import authRoutes from '../routes/authRoutes.js'
import messageRoutes from '../routes/messageRoutes.js'
import { app,server } from '../lib/socket.js'


const Port = process.env.PORT || 5000

app.use(express.json({limit: '5mb'}))
app.use(cookieParser())
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(Port, () => {
  console.log("server is running on PORT:", Port)
  connectDB();
});