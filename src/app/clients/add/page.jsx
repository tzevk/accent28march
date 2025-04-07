"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import styles from "../../styles/addClient.module.css";
import axios from "axios";

export default function AddClientPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/clients", formData);
      if (response.status === 201) {
        alert("Client added successfully");
        setFormData({});
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Something went wrong while saving the client.");
    }
  };

  return (
    <div className={styles.clientsPage}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Add New Client</h2>
        </div>

        <div className={styles.tabControls}>
        {["personal", "branches", "followup"].map((tab) => (
  <button
    key={tab}
    onClick={() => setActiveTab(tab)}
    className={activeTab === tab ? styles.activeTab : ""}
  >
    {tab.charAt(0).toUpperCase() + tab.slice(1)}
  </button>
))}
          <button type="submit" form="clientForm">
            Save
          </button>
        </div>

        <main className={styles.contentArea}>
          <form
            id="clientForm"
            className={styles.editForm}
            onSubmit={handleSubmit}
          >
            {activeTab === "personal" && (
              <div className={styles.formSection}>
                <h4>Personal Information</h4>
                <div className={styles.formGrid}>
                  {/* your personal info fields */}
                  <label>Company Name: <input type="text" name="company_name" onChange={handleChange} /></label>
                  <label>Type: <input type="text" name="type" onChange={handleChange} /></label>
                  <label>City: <input type="text" name="city" onChange={handleChange} /></label>
                  <label>State: <input type="text" name="state" onChange={handleChange} /></label>
                  <label>Phone: <input type="text" name="phone" onChange={handleChange} /></label>
                  <label>Fax: <input type="text" name="fax" onChange={handleChange} /></label>
                  <label>Mobile: <input type="text" name="mobile" onChange={handleChange} /></label>
                  <label>Date: <input type="date" name="date" onChange={handleChange} /></label>
                  <label>Contact Person: <input type="text" name="contact_name" onChange={handleChange} /></label>
                  <label>Email: <input type="email" name="contact_email" onChange={handleChange} /></label>
                  <label>Website: <input type="text" name="website" onChange={handleChange} /></label>
                  <label>Purpose: <input type="text" name="purpose" onChange={handleChange} /></label>
                  <label>Address: <textarea name="address" rows="3" onChange={handleChange} /></label>
                  <label>Status:
                    <select name="status" onChange={handleChange}>
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                  <label>Industry:
                    <input type="text" name="industry" onChange={handleChange} className={styles.input} />
                  </label>
                  <label>Comment: <textarea name="comment" rows="3" onChange={handleChange} /></label>
                </div>
              </div>
            )}

            {activeTab === "branches" && (
              <div className={styles.formSection}>
                <h4>Branch Details</h4>
                <div className={styles.formGrid}>
                  <label>Branch Name: <input name="branch_name" onChange={handleChange} /></label>
                  <label>Branch Address: <input name="branch_address" onChange={handleChange} /></label>
                  <label>Branch Email: <input name="branch_email" onChange={handleChange} /></label>
                  <label>Branch Phone: <input name="branch_phone" onChange={handleChange} /></label>
                </div>
              </div>
            )}

            {activeTab === "followup" && (
              <div className={styles.formSection}>
                <h4>Follow-up</h4>
                <div className={styles.formGrid}>
                  <label>Follow-up Date 1: <input type="date" name="followup1_date" onChange={handleChange} /></label>
                  <label>Follow-up Note 1: <textarea name="followup1_description" rows="3" onChange={handleChange} /></label>
                  <label>Follow-up Date 2: <input type="date" name="followup2_date" onChange={handleChange} /></label>
                  <label>Follow-up Note 2: <textarea name="followup2_description" rows="3" onChange={handleChange} /></label>
                  <label>Follow-up Date 3: <input type="date" name="followup3_date" onChange={handleChange} /></label>
                  <label>Follow-up Note 3: <textarea name="followup3_description" rows="3" onChange={handleChange} /></label>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}