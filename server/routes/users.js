const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  try {
    console.log("User registration route hit");
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("User already exists with email:", req.body.email);
      return res
        .status(409)
        .send({ message: "User with given email address already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();
    console.log("User created:", user);

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    console.log("Token created:", token);

    const url = `${process.env.BASE_URL}api/users/${user._id}/verify/${token.token}`;
    console.log("Verification URL:", url);
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log("Error in registration route:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    console.log("Verification request received with ID:", req.params.id);

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      console.log("Invalid user ID:", req.params.id);
      return res.status(400).send({ message: "Invalid link" });
    }
    console.log("User found:", user);

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      console.log("Invalid token for user ID:", req.params.id);
      return res.status(400).send({ message: "Invalid link" });
    }
    console.log("Token found:", token);

    user.verified = true;
    await user.save();
    console.log("User verified status updated for user ID:", user._id);

    await token.deleteOne();
    console.log("Token deleted for user ID:", user._id);

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Verification error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
