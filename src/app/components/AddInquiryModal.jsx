import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/leadModal.module.css";
import axios from "axios";

const AddInquiryModal = ({ show, onCancel, onSuccess }) => {
    const modalRef = useRef(null);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
      company_name: "",
      type: "",
      city: "",
      enquiry_date: "",
      enquiry_type: "",
      project_status: "",
      followup1_description: "",
    });
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (show) {
        const fetchCompanies = async () => {
          try {
            const res = await axios.get("/api/leads/companies");
            setCompanies(res.data);
          } catch (err) {
            console.error("Failed to fetch companies", err);
          }
        };
  
        fetchCompanies();
  
        const handleEsc = (e) => e.key === "Escape" && onCancel();
        document.addEventListener("keydown", handleEsc);
        modalRef.current?.focus();
        return () => document.removeEventListener("keydown", handleEsc);
      }
    }, [show, onCancel]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("/api/leads", formData);
        if (response.status === 201) {
          onSuccess();
          setFormData({
            company_name: "",
            type: "",
            city: "",
            enquiry_date: "",
            enquiry_type: "",
            project_status: "",
            followup1_description: "",
          });
          setError("");
        }
      } catch (err) {
        console.error("Error submitting inquiry", err);
        setError("Something went wrong while submitting. Please try again.");
      }
    };
  
    if (!show) return null;
  
    return (
      <div className={styles.modalOverlay} role="dialog" aria-modal="true">
        <div className={styles.modalContent} ref={modalRef} tabIndex="-1">
          <button className={styles.closeButton} onClick={onCancel}>
            &times;
          </button>
  
          <h2 className={styles.modalTitle}>Add New Inquiry</h2>
  
          <form onSubmit={handleSubmit} className={styles.formWrapper}>
  {/* Company Name */}
  <div className={styles.formGroup}>
    <label>Company Name</label>
    <select
      name="company_name"
      value={formData.company_name}
      onChange={handleChange}
      className={styles.input}
      required
    >
      <option value="">Select Company</option>
      {companies.map((company, index) => (
        <option key={index} value={company.company_name}>
          {company.company_name}
        </option>
      ))}
    </select>
  </div>

  {/* Type & City */}
  <div className={styles.inlineGroup}>
    <div className={styles.formGroup}>
      <label>Type</label>
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        className={styles.input}
        required
      />
    </div>

    <div className={styles.formGroup}>
      <label>City</label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        className={styles.input}
        required
      />
    </div>
  </div>

  {/* Enquiry Date */}
  <div className={styles.formGroup}>
    <label>Enquiry Date</label>
    <input
      type="date"
      name="enquiry_date"
      value={formData.enquiry_date}
      onChange={handleChange}
      className={styles.input}
      required
    />
  </div>

  {/* Enquiry Type & Project Status */}
  <div className={styles.inlineGroup}>
    <div className={styles.formGroup}>
      <label>Enquiry Type</label>
      <select
        name="enquiry_type"
        value={formData.enquiry_type}
        onChange={handleChange}
        className={styles.input}
        required
      >
        <option value="">Select Enquiry Type</option>
        <option value="Email">Email</option>
        <option value="Call">Call</option>
        <option value="Walk In">Walk In</option>
        <option value="Referral">Referral</option>
        <option value="Website">Website</option>
        <option value="Social Media">Social Media</option>
        <option value="Others">Others</option>
      </select>
    </div>

    <div className={styles.formGroup}>
      <label>Project Status</label>
      <select
        name="project_status"
        value={formData.project_status}
        onChange={handleChange}
        className={styles.input}
        required
      >
        <option value="">Select Project Status</option>
        <option value="Planning">Planning</option>
        <option value="In Progress">In Progress</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  </div>

  {/* Follow-up Description (Optional) */}
  <div className={styles.formGroup}>
    <label>Follow-up Notes</label>
    <textarea
      name="followup1_description"
      value={formData.followup1_description}
      onChange={handleChange}
      className={styles.textarea}
      placeholder="Add any notes here..."
    />
  </div>

  {/* Error Message */}
  {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

  {/* Buttons */}
  <div className={styles.buttonContainer}>
    <button type="submit" className={styles.submitButton}>
      Submit
    </button>
    <button type="button" onClick={onCancel} className={styles.cancelButton}>
      Cancel
    </button>
  </div>
</form>
        </div>
      </div>
    );
  };
  
  export default AddInquiryModal;