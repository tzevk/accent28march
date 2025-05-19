'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/employeeMaster.module.css';
import Sidebar from '../components/Sidebar';

export default function EmployeeMasterPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/users'); // still using 'users' collection
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  const handleEdit = (employee) => {
    router.push(`/users/edit?id=${employee._id}`);
  };

  const handleAddEmployee = () => {
    router.push('/users/add');
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className={styles.clientsPage}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Employee Master</h1>
          <button className={styles.addButton} onClick={handleAddEmployee}>
            + Add New
          </button>
        </div>


        {/* Table */}
        <div className={styles.tableContainer}>
          <div className={styles.scrollableTable}>
            <table className={styles.dashboardTable}>
              <thead>
                <tr>
                  <th>Emp. Code</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Attendance Category</th>
                  <th>Contact No</th>
                  <th>Roles</th>
                  <th>Is Active?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={employee._id}>
                      <td>{employee.empCode || `EMP${index + 1}`}</td>
                      <td>{employee.name}</td>
                      <td>{employee.department || '-'}</td>
                      <td>{employee.designation || '-'}</td>
                      <td>{employee.attendanceCategory || '-'}</td>
                      <td>{employee.phone || '-'}</td>
                      <td>{employee.role}</td>
                      <td><input type="checkbox" disabled checked={employee.isActive ?? true} /></td>
                      <td className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => handleEdit(employee)}>✏️</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(employee._id)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center' }}>No employees found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}