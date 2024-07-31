const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Project } = require("../models/project");
const { isAdmin } = require("../middleware/authMiddleware");

// endpoint to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// endpoint to get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// update a user
router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// delete a user
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User not found");
    await Project.deleteMany({ userId: req.params.id });
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// update a project
router.put("/projects/:id", isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).send("Project not found");
    res.status(200).send(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// delete a project
router.delete("/projects/:id", isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    res.status(200).send("Project deleted");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
