"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import styles from "../styles/allClients.module.css";
import ReactModal from "react-modal";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/leads/companies");
      const data = await res.json();
      setCompanies(data);
    };
    fetchData();
  }, []);

  const handleEditClick = (company) => {
    setEditingCompany(company.company_name);
    setFormData(company);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/leads/${formData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update company");

      const updatedCompany = await res.json();
      setCompanies((prev) =>
        prev.map((c) => (c._id === updatedCompany._id ? updatedCompany : c))
      );
      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error("Error updating company:", err);
    }
  };

  return (
    <div className={styles.clientsPage}>
      <Sidebar />
      <div className={styles.mainContent}>
        <main className={styles.contentArea}>
          <div className={styles.header}>
            <Users size={28} />
            <h2>All Company Records</h2>
            <p className={styles.description}>
              View and manage your client organizations efficiently.
            </p>
          </div>

          <div className={styles.card}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{c.company_name}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(c)}
                        className={styles.editButton}
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Edit Company Details"
            ariaHideApp={false}
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            <form className={styles.editForm} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>Edit Client: {editingCompany}</h3>
              <p className={styles.formNote}>
                Please update the relevant company and contact information below.
              </p>

              <div className={styles.formGrid}>
                <label>
                  Company Name:
                  <input
                    placeholder="e.g. Prism International Pvt Ltd"
                    name="company_name"
                    value={formData.company_name || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Designation:
                  <input
                    placeholder="e.g. Managing Director"
                    name="designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  City:
                  <input
                    placeholder="e.g. Mumbai"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  State:
                  <input
                    placeholder="e.g. Maharashtra"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    placeholder="e.g. 022-12345678"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    placeholder="e.g. contact@company.com"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Website:
                  <input
                    placeholder="e.g. www.company.com"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Contact Person:
                  <input
                    placeholder="e.g. Mr. Rajat Sharma"
                    name="contact_person"
                    value={formData.contact_person || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Address:
                  <textarea
                    placeholder="Full office address here"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Status:
                  <select
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
                <label>
                  Purpose:
                  <input
                    placeholder="e.g. Quotation Request"
                    name="purpose"
                    value={formData.purpose || ""}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.saveButton}>
                  ✅ Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelButton}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </ReactModal>
        </main>
      </div>
    </div>
  );
}