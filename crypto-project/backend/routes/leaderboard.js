// backend/routes/leaderboard.js
import { Router } from "express";
import Portfolio from "../models/Portfolio.js";
import { coingeckoGet } from "../config/coingecko.js";

const router = Router();

// 🔹 helper to fetch live coin price
const fetchCoinPrices = async (coinIds) => {
  if (coinIds.length === 0) return {};

  try {
    const response = await coingeckoGet("/simple/price", {
      params: {
        ids: [...new Set(coinIds)].join(","),
        vs_currencies: "usd",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coin prices:", error.message);
    return {};
  }
};


router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate("userId", "username"); 
    const coinIds = portfolios.flatMap((portfolio) =>
      portfolio.coins.map((coin) => coin.id)
    );
    const prices = await fetchCoinPrices(coinIds);

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
          const livePrice = prices[coin.id]?.usd || 0;
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
