import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

const Admin = ({ userName, email }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:8080/api/admin/projects", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      setProjects(projects.filter((project) => project.userId !== id));
      toast.success("User and their projects deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user and their projects");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(projects.filter((project) => project._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  const handleEditProject = (project) => {
    setEditProject(project);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (
      !editProject.projectName ||
      !editProject.githubLink ||
      !editProject.thumbnail
    ) {
      toast.error("Project Name, GitHub Link, and Thumbnail cannot be empty");
      return;
    }

    try {
      const updatedProject = await axios.put(
        `http://localhost:8080/api/admin/projects/${editProject._id}`,
        editProject,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProjects(
        projects.map((project) =>
          project._id === updatedProject.data._id
            ? updatedProject.data
            : project
        )
      );
      toast.success("Project updated successfully");
      setEditProject(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.main_container}>
      <ToastContainer />
      <nav className={styles.navbar}>
        <h1>Admin Dashboard</h1>
        <h2>Welcome, {userName}!</h2>
        <h3>Email: {email}</h3>
      </nav>
      <div className={styles.content}>
        {users
          .filter((user) => user.role === "student")
          .map((user) => (
            <div key={user._id} className={styles.user_container}>
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className={`${styles.button} ${styles.delete_btn}`}>
                Delete User
              </button>
              <h3>Projects</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>GitHub Link</th>
                    <th>Thumbnail</th>
                    <th>Live Hosted Link</th>
                    <th>Tech Stack</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects
                    .filter((project) => project.userId === user._id)
                    .map((project) => (
                      <tr key={project._id}>
                        <td>{project.projectName}</td>
                        <td>
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer">
                            {project.githubLink}
                          </a>
                        </td>
                        <td>
                          <img
                            src={project.thumbnail}
                            alt={project.projectName}
                            className={styles.thumbnail}
                          />
                        </td>
                        <td>
                          <a
                            href={project.liveHostedLink}
                            target="_blank"
                            rel="noopener noreferrer">
                            {project.liveHostedLink}
                          </a>
                        </td>
                        <td>{project.techStack}</td>
                        <td>
                          <button
                            onClick={() => handleEditProject(project)}
                            className={`${styles.button} ${styles.edit_btn}`}>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className={`${styles.button} ${styles.delete_btn}`}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
      {editProject && (
        <div className={styles.modal}>
          <form onSubmit={handleUpdateProject} className={styles.form}>
            <h2>Edit Project</h2>
            <label>
              Project Name:
              <input
                type="text"
                value={editProject.projectName}
                onChange={(e) =>
                  setEditProject({
                    ...editProject,
                    projectName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              GitHub Link:
              <input
                type="text"
                value={editProject.githubLink}
                onChange={(e) =>
                  setEditProject({ ...editProject, githubLink: e.target.value })
                }
              />
            </label>
            <label>
              Thumbnail:
              <input
                type="text"
                value={editProject.thumbnail}
                onChange={(e) =>
                  setEditProject({ ...editProject, thumbnail: e.target.value })
                }
              />
            </label>
            <label>
              Live Hosted Link:
              <input
                type="text"
                value={editProject.liveHostedLink}
                onChange={(e) =>
                  setEditProject({
                    ...editProject,
                    liveHostedLink: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Tech Stack:
              <input
                type="text"
                value={editProject.techStack}
                onChange={(e) =>
                  setEditProject({ ...editProject, techStack: e.target.value })
                }
              />
            </label>
            <div className={styles.form_buttons}>
              <button type="submit" className={styles.button}>
                Update Project
              </button>
              <button
                type="button"
                onClick={() => setEditProject(null)}
                className={`${styles.button} ${styles.cancel_btn}`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
