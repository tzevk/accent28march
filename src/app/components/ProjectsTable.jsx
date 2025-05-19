// File: components/ProjectTable.jsx
import { useState, useEffect } from "react";
import styles from "../styles/leads.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectModal from "./ProjectModal";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const router = useRouter();

  const [newProject, setNewProject] = useState({
    "Company Name": "",
    "Project Description": "",
    "Start Date": "",
    "End Date": "",
    "Date of Completion": "",
    "Project Mode": ""
  });

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");

      const mapped = response.data.map((doc) => {
        const sr = doc.Sr || {};
        return {
          _id: doc._id,
          companyName: sr["Company Name"] || "-",
          projectName: sr["Project Description"] || "-",
          startDate: sr["Start Date"] || "-",
          endDate: sr["End Date"] || "-",
          actualEndDate: sr["Date of Completion"] || "-",
          type: sr["Project Mode"] || "-"
        };
      });

      setProjects(mapped);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddNew = () => {
    router.push('/projects/add');
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setNewProject({
      "Company Name": project.companyName,
      "Project Description": project.projectName,
      "Start Date": project.startDate,
      "End Date": project.endDate,
      "Date of Completion": project.actualEndDate,
      "Project Mode": project.type
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProject) {
        await axios.put(`/api/projects/${selectedProject._id}`, newProject);
      } else {
        await axios.post("/api/projects", newProject);
      }
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Project Listing</h1>

      <div className={styles.filterContainer}>
        <button className={styles.addButton} onClick={handleAddNew}>
          ➕ Add Project
        </button>
      </div>

      <ProjectModal
        show={showModal}
        project={newProject}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={() => setShowModal(false)}
      />

      <div className={styles.tableContainer}>
        <div className={styles.scrollableTable}>
          <table className={styles.dashboardTable}>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Project</th>
                <th>Client</th>
                <th>Start Date</th>
                <th>Planned End</th>
                <th>Actual End</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>Loading...</td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{index + 1}</td>
                    <td>{project.projectName}</td>
                    <td>{project.companyName}</td>
                    <td>{project.startDate}</td>
                    <td>{project.endDate}</td>
                    <td>{project.actualEndDate}</td>
                    <td>{project.type}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => handleEdit(project)}>Edit</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(project._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" style={{ textAlign: "center" }}>No Data Available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;