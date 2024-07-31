import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

const Student = ({ userName, email }) => {
  const [projectName, setProjectName] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [liveHostedLink, setLiveHostedLink] = useState("");
  const [techStack, setTechStack] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [errors, setErrors] = useState({
    projectName: "",
    githubLink: "",
    thumbnail: "",
  });

  const backendUrl = "http://localhost:8080"; // backend URL

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/projects/${email}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [email, backendUrl]);

  const handleAddProject = async () => {
    let validationErrors = {};
    if (!projectName) validationErrors.projectName = "Project Name is required";
    if (!githubLink) validationErrors.githubLink = "GitHub Link is required";
    if (!thumbnail) validationErrors.thumbnail = "Thumbnail is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("projectName", projectName);
    formData.append("githubLink", githubLink);
    formData.append("thumbnail", thumbnail);
    formData.append("liveHostedLink", liveHostedLink);
    formData.append("techStack", techStack);

    console.log("Form Data:", Array.from(formData.entries()));

    try {
      const response = await axios.post(
        `${backendUrl}/api/projects`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProjects([...projects, response.data]);
      setProjectName("");
      setGithubLink("");
      setThumbnail(null);
      setLiveHostedLink("");
      setTechStack("");
      setErrors({
        projectName: "",
        githubLink: "",
        thumbnail: "",
      });
      toast.success("Project added successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project.");
    }
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleEditProject = (project) => {
    setProjectName(project.projectName);
    setGithubLink(project.githubLink);
    setLiveHostedLink(project.liveHostedLink || "");
    setTechStack(project.techStack || "");
    setEditingProject(project._id);
  };

  const handleUpdateProject = async () => {
    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("githubLink", githubLink);
    formData.append("liveHostedLink", liveHostedLink);
    formData.append("techStack", techStack);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/projects/${editingProject}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProjects(
        projects.map((project) =>
          project._id === editingProject ? response.data : project
        )
      );
      setProjectName("");
      setGithubLink("");
      setLiveHostedLink("");
      setTechStack("");
      setThumbnail(null);
      setEditingProject(null);
      setErrors({
        projectName: "",
        githubLink: "",
        thumbnail: "",
      });
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${backendUrl}/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className={styles.main_container}>
      <ToastContainer />
      <nav className={styles.navbar}>
        <h1>Student Dashboard</h1>
        <h2>Welcome, {userName}!</h2>
        <h3>Email: {email}</h3>
      </nav>
      <div className={styles.project_section}>
        <h2>{editingProject ? "Edit Project" : "Add a Project"}</h2>
        <div className={styles.input_container}>
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            placeholder="Enter your project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          {errors.projectName && (
            <p className={styles.error}>{errors.projectName}</p>
          )}
        </div>
        <div className={styles.input_container}>
          <label htmlFor="githubLink">GitHub Link</label>
          <input
            type="text"
            id="githubLink"
            placeholder="Enter your GitHub link"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
          {errors.githubLink && (
            <p className={styles.error}>{errors.githubLink}</p>
          )}
        </div>
        <div className={styles.input_container}>
          <label htmlFor="thumbnail">Thumbnail</label>
          <input type="file" id="thumbnail" onChange={handleThumbnailChange} />
          {errors.thumbnail && (
            <p className={styles.error}>{errors.thumbnail}</p>
          )}
        </div>
        <div className={styles.input_container}>
          <label htmlFor="liveHostedLink">Live Hosted Link</label>
          <input
            type="text"
            id="liveHostedLink"
            placeholder="Enter live hosted link"
            value={liveHostedLink}
            onChange={(e) => setLiveHostedLink(e.target.value)}
          />
        </div>
        <div className={styles.input_container}>
          <label htmlFor="techStack">Tech Stack Used</label>
          <input
            type="text"
            id="techStack"
            placeholder="Enter tech stack used"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
        </div>
        {editingProject ? (
          <button onClick={handleUpdateProject}>Update Project</button>
        ) : (
          <button onClick={handleAddProject}>Add Project</button>
        )}
      </div>
      <div className={styles.project_list}>
        <h2>Your Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={project._id} className={styles.project_item}>
              <div className={styles.thumbnail_container}>
                {project.thumbnail && (
                  <img
                    src={`${project.thumbnail}`}
                    alt={`${project.projectName} Thumbnail`}
                  />
                )}
              </div>
              <div className={styles.project_info}>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  {project.projectName}
                </a>
                {project.liveHostedLink && (
                  <div>
                    <strong>Live Hosted Link: </strong>
                    <a
                      href={project.liveHostedLink}
                      target="_blank"
                      rel="noopener noreferrer">
                      {project.liveHostedLink}
                    </a>
                  </div>
                )}
                {project.techStack && (
                  <div>
                    <strong>Tech Stack Used: </strong>
                    <span>{project.techStack}</span>
                  </div>
                )}
              </div>
              <div className={styles.project_actions}>
                <button
                  className={styles.edit_btn}
                  onClick={() => handleEditProject(project)}>
                  Edit
                </button>
                <button
                  className={styles.delete_btn}
                  onClick={() => handleDeleteProject(project._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Student;
