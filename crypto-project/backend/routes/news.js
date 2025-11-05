// routes/news.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://api.mediastack.com/v1/news", {
      params: {
        access_key: process.env.MEDIASTACK_KEY,
        keywords: "crypto",
        languages: "en",
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
