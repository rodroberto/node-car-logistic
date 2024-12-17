const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/User"); // Import the Sequelize User model

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Handle Login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user in DB
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Verify password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      {
        id: foundUser.id,
        role: foundUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: foundUser.id,
        firstName: foundUser.first_name,
        lastName: foundUser.last_name,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Handle Register
const handleRegister = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const role = "Manager"; // Default role for new users

  // Validate required fields
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate role
  const allowedRoles = ["Super Admin", "Manager", "Team Lead", "Service Agent"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        first_name,
        last_name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Request Password Reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(resetLink);

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    };

    await sgMail.send(msg);

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  forgotPassword,
  resetPassword,
};
