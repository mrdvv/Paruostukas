import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from "../helpers/auth.js";

// Register new user

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login existing user

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};