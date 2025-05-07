import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import query from "../utils/supabaseQuery.js";

const router = express.Router();

// testing
router.get("/test-db", async (req, res) => {
  try {
    const result = await query("SELECT * FROM admin_users");
    res.json({
      count: result.length,
      users: result.map((u) => ({ id: u.id, email: u.email })),
    });
  } catch (error) {
    console.error("DB test error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt received:", email);

  try {
    // Check if the user exists and is an admin
    console.log("Querying database for user...");
    const users = await query(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
      [email]
    );
    console.log("Database returned users:", users.length);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = users[0];

    // Compare password
    console.log("Comparing passwords...");
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    console.log("Generating JWT token...");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET || "temporary-fallback-secret",
      { expiresIn: "4h" }
    );

    // Return the token
    console.log("Login successful, returning token");
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
});

export default router;
