import { useState, useEffect } from "react";
import styles from "../styles/leads.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/create", newUser);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>User Management</h1>
      <button className={styles.addButton} onClick={() => setShowModal(true)}>➕ Create User</button>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2>Create New User</h2>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <input name="name" placeholder="Name" value={newUser.name} onChange={handleInputChange} required />
              <input name="email" placeholder="Email" type="email" value={newUser.email} onChange={handleInputChange} required />
              <input name="password" placeholder="Password" type="password" value={newUser.password} onChange={handleInputChange} required />
              <select name="role" value={newUser.role} onChange={handleInputChange} required>
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="PROJECT MANAGER">Project Manager</option>
                <option value="USER">User</option>
              </select>
              <div className={styles.buttonRow}>
                <button type="submit" className={styles.saveButton}>Create</button>
                <button type="button" className={styles.clearButton} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <div className={styles.scrollableTable}>
          <table className={styles.dashboardTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No Users Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;