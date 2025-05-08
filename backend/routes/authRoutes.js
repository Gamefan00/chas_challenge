import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import query from "../utils/supabaseQuery.js";

const router = express.Router();

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

    // Set token as HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
      path: "/",
    });

    // Return success response
    console.log("Login successful, cookie set");
    return res.status(200).json({
      message: "Login successful",
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

// Verify admin status middleware

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "temporary-fallback-secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    }
  );
};

// Verify admin route
router.get("/verify-admin", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      isAdmin: req.user.isAdmin,
      message: req.user.isAdmin
        ? "User has admin access"
        : "User is not an admin",
    });
  } catch (error) {
    console.log("Admin verification error:", error);
    res.status(500).json({ message: "Server error during admin verification" });
  }
});

// Logout route - clear the cookie
router.post("/logout", (req, res) => {
  res.clearCookie("authToken", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
