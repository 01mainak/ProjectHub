const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { Project } = require("../models/project");
const { User } = require("../models/user");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project_thumbnails",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and JPG files are allowed."
        ),
        false
      );
    }
  },
});

router.post("/", upload.single("thumbnail"), async (req, res) => {
  const { email, projectName, githubLink, liveHostedLink, techStack } =
    req.body;

  if (!email || !projectName || !githubLink || !req.file) {
    return res.status(400).send("All mandatory fields are required.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email");

    const project = new Project({
      userId: user._id,
      projectName,
      githubLink,
      thumbnail: req.file.path,
      liveHostedLink,
      techStack,
    });

    await project.save();
    res.status(201).send(project);
  } catch (error) {
    console.error("Error creating project:", error.message, error.stack);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", upload.single("thumbnail"), async (req, res) => {
  const { projectName, githubLink, liveHostedLink, techStack } = req.body;

  if (!projectName || !githubLink) {
    return res.status(400).send("Project name and GitHub link are required.");
  }

  try {
    const updateFields = { projectName, githubLink, liveHostedLink, techStack };

    if (req.file) {
      updateFields.thumbnail = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!project) return res.status(404).send("Project not found");

    res.status(200).send(project);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).send("Invalid email");

    const projects = await Project.find({ userId: user._id });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send("Project not found");

    res.status(200).send("Project deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
