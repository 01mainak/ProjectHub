const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { error } = validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("Email not registered:", req.body.email);
      return res
        .status(401)
        .send({ message: "Email not registered. Please Sign in" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      console.log("Invalid password");
      return res.status(401).send({ message: "Invalid Password" });
    }
    const validRole = req.body.role === user.role;
    if (!validRole) {
      console.log("Invalid role");
      return res.status(401).send({ message: "Invalid Role" });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        console.log("Verification URL:", url); // Log the URL
        await sendEmail(user.email, "Verify Email", url);
      }
      console.log("Email verification required");
      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "logged in successfully" });
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().required().label("Role"),
  });
  return schema.validate(data);
};

module.exports = router;
