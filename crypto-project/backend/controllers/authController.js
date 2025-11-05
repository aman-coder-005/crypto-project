import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER CONTROLLER
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received registration data:", req.body);
  console.log("Register attempt with email:", email, "and username:", username);
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed password:", hashedPassword);
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("New user created:", newUser);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Send response
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email, password);
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    else {
      console.log("User found:", user);
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    // Send response
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
