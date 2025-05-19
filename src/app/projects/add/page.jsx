'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import styles from "../../styles/addClient.module.css";
import Sidebar from '../../components/Sidebar';
import axios from 'axios'; 

export default function AddProjectPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectNumber: '',
    projectName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetDate: '',
    progress: '',
    status: '',
    assignedTo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/projects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('✅ Project added successfully!');
        router.push('/projects');
      } else {
        alert('❌ Failed to add project.');
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      alert('❌ Error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.clientsPage}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.contentArea}>
          {/* Tab Navigation */}
          <div className={styles.tabControls}>
            <button
              type="button"
              className={activeTab === 'basic' ? styles.activeTab : ''}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button
              type="button"
              className={activeTab === 'status' ? styles.activeTab : ''}
              onClick={() => setActiveTab('status')}
            >
              Status & Assignment
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.editForm} id="projectForm">
            {activeTab === 'basic' && (
              <div className={styles.formSection}>
                <h4>Project Details</h4>
                <div className={styles.formGrid}>
                  <label>
                    Project Number
                    <input
                      type="text"
                      name="projectNumber"
                      value={formData.projectNumber}
                      onChange={handleChange}
                      placeholder="e.g., PRJ-2025-001"
                      required
                    />
                  </label>
                  <label>
                    Project Name
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="e.g., Smart Parking System"
                      required
                    />
                  </label>
                  <label>
                    Start Date
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    End Date
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      required
                    />
                  </label>
                  <label>
                    Target Date
                    <input
                      type="date"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleChange}
                      min={formData.startDate}
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className={styles.formSection}>
                <h4>Status & Assignment</h4>
                <div className={styles.formGrid}>
                  <label>
                    Progress (%)
                    <input
                      type="number"
                      name="progress"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleChange}
                      placeholder="e.g., 50"
                    />
                  </label>
                  <label>
                    Status
                    <select name="status" value={formData.status} onChange={handleChange} required>
                      <option value="">-- Select Status --</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </label>
                  <label>
                    Assigned To
                    <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                      <option value="">-- Select Member --</option>
                      <option value="Tanvi Kadam">Tanvi Kadam</option>
                      {/* Replace with dynamic employee list if needed */}
                    </select>
                  </label>
                </div>
              </div>
            )}
          </form>

          {/* Button Row */}
          <div className={styles.buttonRow}>
            <button type="button" onClick={() => router.push('/projects')}>Cancel</button>
            <button type="submit" form="projectForm" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}