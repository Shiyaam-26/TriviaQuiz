const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
const User = require("./models/User");

const app = express();

// 🟢 Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(
  session({
    secret: "your_secret_key", // Change to a strong key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// 🟢 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/MernProj")
  .then(() => console.log("✅ Database Connected"))
  .catch((error) => console.error("❌ Database Connection Error:", error));

// 🔵 Register User
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, scores: [] });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔵 Login User (Session-based)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid email or password!" });
    }

    // Save user session
    req.session.user = { userId: user._id, name: user.name };

    res.json({ msg: "Login successful!", user: req.session.user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔵 Get Authenticated User
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ isAuthenticated: false, msg: "Not logged in!" });
  }
});

// 🔵 Logout User
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout Error:", err);
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out successfully!" });
  });
});

// 🟠 Submit Quiz Score (Protected Route)
app.post("/api/submit-quiz", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Unauthorized! Please login first." });
  }

  try {
    const { score } = req.body;
    const userId = req.session.user.userId;

    await User.findByIdAndUpdate(userId, { $push: { scores: score } });

    res.json({ msg: "Score saved successfully!" });
  } catch (error) {
    console.error("❌ Quiz Submission Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🚀 Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
