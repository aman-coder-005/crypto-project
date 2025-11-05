import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// Save a new message
router.post("/", async (req, res) => {
    const { room, message, user } = req.body;
    if (!room || !message) return res.status(400).json({ error: "Missing data" });

    try {
        const newMessage = new Chat({ room, message, user })
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Failed to save message" });
    }
});
// Get messages for a room
router.get("/:room", async (req, res) => {
    try {
        const messages = await Chat.find({ room: req.params.room }).sort({ timestamp: -1 }).populate("user", "username"); // Populate user field with username
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

export default router