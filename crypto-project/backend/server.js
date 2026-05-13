import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { requireDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/User.js";
import portfolioRoutes from "./routes/portfolio.js";
import newsRoutes from "./routes/news.js";
import marketRoutes from "./routes/market.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import chat from "./routes/chat.js";
import priceRoutes from "./routes/prices.js";

dotenv.config({ quiet: true });

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", requireDB, authRoutes);
app.use("/api/portfolio", requireDB, portfolioRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/user", requireDB, userRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/leaderboard", requireDB, leaderboardRoutes);
app.use("/api/chat", requireDB, chat);
app.use("/api/prices", priceRoutes);

app.get("/api/ping", (req, res) => {
  res.send("Backend is working!");
});

if (!process.env.VERCEL) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  // Socket.io is only used by the local long-running backend.
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("sendMessage", (msg) => {
      io.to(msg.room).emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 5000;

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the other backend process or set a different PORT in .env.`
      );
      process.exit(1);
    }

    console.error("Server failed to start:", error);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
