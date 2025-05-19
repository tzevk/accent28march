'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import styles from "../../styles/addClient.module.css";
import Sidebar from '../../components/Sidebar';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEmployeePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    empCode: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    attendanceCategory: '',
    role: 'staff',
    status: 'active',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Employee added successfully!');
        router.push('/users');
      } else {
        const data = await res.json();
        toast.error(`Failed: ${data.error || 'Something went wrong'}`);
      }
    } catch (err) {
      toast.error('Network error');
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.clientsPage}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.contentArea}>
          <div className={styles.tabControls}>
            <button type="button" className={activeTab === 'basic' ? styles.activeTab : ''} onClick={() => setActiveTab('basic')}>Basic Info</button>
            <button type="button" className={activeTab === 'account' ? styles.activeTab : ''} onClick={() => setActiveTab('account')}>Account & Role</button>
            <button type="button" className={activeTab === 'status' ? styles.activeTab : ''} onClick={() => setActiveTab('status')}>Status</button>
          </div>

          <form onSubmit={handleSubmit} className={styles.editForm} id="employeeForm">
            {activeTab === 'basic' && (
              <div className={styles.formSection}>
                <h4>Employee Details</h4>
                <div className={styles.formGrid}>
                  <label>
                    Employee Code
                    <input type="text" name="empCode" value={formData.empCode} onChange={handleChange} required />
                  </label>
                  <label>
                    Full Name
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </label>
                  <label>
                    Phone Number
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength={10} required />
                  </label>
                  <label>
                    Department
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                  </label>
                  <label>
                    Designation
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
                  </label>
                  <label>
                    Attendance Category
                    <select name="attendanceCategory" value={formData.attendanceCategory} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Teaching Staff">Teaching Staff</option>
                      <option value="Non-teaching Staff & Others">Non-teaching Staff & Others</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className={styles.formSection}>
                <h4>Account Info</h4>
                <div className={styles.formGrid}>
                  <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </label>
                  <label>
                    Password
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                  </label>
                  <label>
                    Role
                    <select name="role" value={formData.role} onChange={handleChange} required>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className={styles.formSection}>
                <h4>Employment Status</h4>
                <div className={styles.formGrid}>
                  <label>
                    Status
                    <select name="status" value={formData.status} onChange={handleChange} required>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    Is Active?
                  </label>
                </div>
              </div>
            )}
          </form>

          <div className={styles.buttonRow}>
            <button type="button" onClick={() => router.push('/users')}>Cancel</button>
            <button type="submit" form="employeeForm" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}