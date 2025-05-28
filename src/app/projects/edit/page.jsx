'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../../styles/leads.module.css';
import Sidebar from '../../components/Sidebar';
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
            <label>
              Company Name
              <input name="companyName" value={formData.companyName} onChange={handleChange} />
            </label>
            <label>
              Project Description
              <input name="projectName" value={formData.projectName} onChange={handleChange} />
            </label>
            <label>
              Start Date
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </label>
            <label>
              End Date
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </label>
            <label>
              Completion Date
              <input type="date" name="actualEndDate" value={formData.actualEndDate} onChange={handleChange} />
            </label>
            <label>
              Project Mode
              <input name="projectMode" value={formData.projectMode} onChange={handleChange} />
            </label>
            <label>
              Assigned To
              <input name="assignedTo" value={formData.assignedTo} onChange={handleChange} />
            </label>
            <label>
              Salary
              <input name="salary" value={formData.salary} onChange={handleChange} />
            </label>
            <label>
              Manhours
              <input name="manhours" value={formData.manhours} onChange={handleChange} />
            </label>
            <label>
              Manpower
              <input name="manpower" value={formData.manpower} onChange={handleChange} />
            </label>
          </div>
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.saveButton}>Save Project</button>
          </div>
                      <button type="button" onClick={() => router.push('/projects')} className={styles.clearButton}>
  ← Back to Projects
</button>
        </form>
      </div>
    </div>
  );
}