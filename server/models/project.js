const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  liveHostedLink: {
    type: String,
  },
  techStack: {
    type: String,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
