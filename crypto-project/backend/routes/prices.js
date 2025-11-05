// routes/prices.js
import express from "express";
import axios from "axios";

const router = express.Router();

let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute


router.get("/", async (req, res) => {
    const now = Date.now();

    if (cachedPrices && now - lastFetched < CACHE_DURATION) {
        return res.json(cachedPrices); // ✅ Return cached response
    }

    try {
        const ids = [
            "bitcoin",
            "ethereum",
            "solana",
            "ripple",
            "litecoin",
            "cardano",
            "dogecoin",
            "polkadot",
        ].join(",");

        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
                params: {
                    ids,
                    vs_currencies: "inr",
                },
            }
        );

        cachedPrices = response.data;
        lastFetched = now;

        res.json(cachedPrices); // ✅ Fresh API response
    } catch (error) {
        console.error("Failed to fetch prices:", error.message);
        res.status(500).json({ error: "Failed to fetch prices" });
    }
});

export default router;
