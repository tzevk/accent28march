'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../styles/leads.module.css';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function EditProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('id');

  const [formData, setFormData] = useState({
    companyName: '',
    projectName: '',
    startDate: '',
    endDate: '',
    actualEndDate: '',
    projectMode: '',
    assignedTo: '',
    salary: '',
    manhours: '',
    manpower: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`);
        const sr = res.data.Sr || {};
        setFormData({
          companyName: sr["Company Name"] || '',
          projectName: sr["Project Description"] || '',
          startDate: sr["Start Date"] || '',
          endDate: sr["End Date"] || '',
          actualEndDate: sr["Date of Completion"] || '',
          projectMode: sr["Project Mode"] || '',
          assignedTo: sr["Assigned To"] || '',
          salary: sr["Salary"] || '',
          manhours: sr["Manhours"] || '',
          manpower: sr["Manpower"] || ''
        });
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${projectId}`, formData);
      alert('✅ Project updated successfully');
      router.push('/projects');
    } catch (error) {
      console.error('❌ Failed to update project:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Edit Project</h1>
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {[
              ['Company Name', 'companyName'],
              ['Project Description', 'projectName'],
              ['Start Date', 'startDate', 'date'],
              ['End Date', 'endDate', 'date'],
              ['Completion Date', 'actualEndDate', 'date'],
              ['Project Mode', 'projectMode'],
              ['Assigned To', 'assignedTo'],
              ['Salary', 'salary'],
              ['Manhours', 'manhours'],
              ['Manpower', 'manpower'],
            ].map(([label, name, type = 'text']) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </label>
            ))}
          </div>
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.saveButton}>Save Project</button>
            <button type="button" onClick={() => router.push('/projects')} className={styles.clearButton}>
              ← Back to Projects
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}