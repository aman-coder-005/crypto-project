// backend/routes/leaderboard.js
import { Router } from "express";
import Portfolio from "../models/Portfolio.js";
import User from "../models/user.js"; // to fetch username
import axios from "axios";

const router = Router();

// 🔹 helper to fetch live coin price
const fetchCoinPrice = async (coinId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/prices` // call your own prices route
    );
    return response.data[coinId]?.usd || 0;
  } catch (error) {
    console.error("Error fetching coin price:", error.message);
    return 0;
  }
};


router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate("userId", "username"); 

    const leaderboard = await Promise.all(
      portfolios.map(async (portfolio) => {
        // Handle null user case
        if (!portfolio.userId) {
          console.warn("Portfolio with no userId found:", portfolio._id);
          return null;
        }

        let totalInvested = 0;
        let currentValue = 0;

        for (const coin of portfolio.coins) {
          const livePrice = await fetchCoinPrice(coin.id);
          totalInvested += coin.quantity * coin.buyPrice;
          currentValue += coin.quantity * livePrice;
        }

        const profitPercentage =
          totalInvested > 0
            ? ((currentValue - totalInvested) / totalInvested) * 100
            : 0;

        return {
          username: portfolio.userId.username,
          profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        };
      })
    );

    // Filter out null entries and sort highest profit first
    const validLeaderboard = leaderboard.filter(entry => entry !== null);
    validLeaderboard.sort((a, b) => b.profitPercentage - a.profitPercentage);

    res.json(validLeaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
