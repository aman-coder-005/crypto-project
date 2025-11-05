import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// Save or update user's portfolio
router.post("/", async (req, res) => {
    const { userId, coins } = req.body;
    if (!userId || !coins) return res.status(400).json({ error: "Missing data" });

    try {
        const updated = await Portfolio.findOneAndUpdate(
            { userId },
            { coins },
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to save portfolio" });
    }
});

// Get user's portfolio
router.get("/:userId", async (req, res) => {
    try {
        const data = await Portfolio.findOne({ userId: req.params.userId });
        console.log("Portfolio data:", data);
        res.json(data?.coins || []);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch portfolio" });
    }
});

export default router;