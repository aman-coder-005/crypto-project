import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/User.js";
import portfolioRoutes from "./routes/portfolio.js";
import newsRoutes from "./routes/news.js";
import marketRoutes from "./routes/market.js";
import leaderboardRoutes from './routes/leaderboard.js';
import chat from './routes/chat.js';
import priceRoutes from "./routes/prices.js";

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/market", marketRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use("/api/chat", chat);
app.use("/api/prices", priceRoutes);

app.get("/api/ping", (req, res) => {
  res.send("✅ Backend is working!");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", (msg) => {
    io.to(msg.room).emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start only ONE server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
