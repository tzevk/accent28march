// File: components/ProjectModal.jsx
import React from "react";

const modalStyle = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "700px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
    gap: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

const ProjectModal = ({ show, project, onChange, onSubmit, onCancel }) => {
  if (!show) return null;

  const fields = [
    ["projectName", "Project Name"],
    ["enquiryNo", "Enquiry No."],
    ["clientName", "Client Name"],
    ["address", "Address"],
    ["contactPerson", "Contact Person"],
    ["director", "Director"],
    ["managingDirector", "Managing Director"],
    ["generalManager", "General Manager"],
    ["startDate", "Start Date", "date"],
    ["plannedEndDate", "Planned End Date", "date"],
    ["actualEndDate", "Actual End Date", "date"],
    ["consultancyId", "Consultancy ID"],
    ["consultancyName", "Consultancy Name"],
    ["type", "Type"],
  ];

  return (
    <div style={modalStyle.backdrop}>
      <div style={modalStyle.container}>
        <h2>Project Details</h2>
        <form onSubmit={onSubmit}>
          {fields.map(([name, label, type = "text"]) => (
            <div key={name} style={modalStyle.formGroup}>
              <label htmlFor={name} style={modalStyle.label}>{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                value={project[name] || ""}
                onChange={onChange}
                style={modalStyle.input}
              />
            </div>
          ))}

          <div style={modalStyle.actions}>
            <button type="button" style={{ ...modalStyle.button, backgroundColor: "#ccc" }} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" style={{ ...modalStyle.button, backgroundColor: "#0070f3", color: "#fff" }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;