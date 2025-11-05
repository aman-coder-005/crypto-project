// backend/routes/market.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET coin list
router.get("/coins", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching coin list:", error);
    res.status(500).json({ message: "Failed to fetch coins." });
  }
});

// GET coin price history (7 days)
router.get("/price-history/:coinId", async (req, res) => {
  const { coinId } = req.params;

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
    );

    const formatted = response.data.prices.map(([time, price]) => ({
      time: new Date(time).toLocaleDateString(),
      price,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ message: "Failed to fetch price history." });
  }
});

export default router;
