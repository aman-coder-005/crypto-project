import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/user.js";
const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
  res.json({
    msg: "Welcome to your profile!",
    user: req.user
  });
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});


export default router;
