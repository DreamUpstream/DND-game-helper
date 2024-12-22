import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { SECRET_KEY } from "../config.js";

const router = express.Router();

// Register a user
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["DM", "Player"])
      .withMessage("Role must be DM or Player"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ error: "Username already exists" });

      const newUser = new User({ username, password, role });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login a user
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.json({ token, role: user.role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
