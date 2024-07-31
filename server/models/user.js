const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "admin"] },
  verified: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id, name: this.name, email: this.email, role: this.role },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  console.log("Validating data:", data);
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().required().valid("student", "admin").label("Role"),
  });
  console.log("Sent for Validation:", data);
  return schema.validate(data);
};

module.exports = { User, validate };
