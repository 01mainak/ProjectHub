require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const adminRoutes = require("./routes/admin");
const { protect } = require("./middleware/authMiddleware");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

connection();

// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", protect, adminRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
