'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      const username = e.target.username.value.trim();
      const password = e.target.password.value.trim();
      const role = e.target.role.value;
  
      const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'manager', password: 'manager123', role: 'project manager' },
        { username: 'user', password: 'user123', role: 'user' },
      ];
  
      const user = users.find(
        (u) => u.username === username && u.password === password && u.role === role
      );
  
      if (user) {
        setTimeout(() => {
          router.push('/dashboard'); // Replace with your route
        }, 300);
      } else {
        setError('Invalid credentials or role. Please try again.');
      }
  
      setLoading(false);
    };
  
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <Image
            src="/accent.png"
            alt="Accent Logo"
            className={styles.logo}
            width={280}
            height={280}
            priority
          />
  
          {error && <p className={styles.error}>{error}</p>}
  
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input name="username" type="text" required placeholder="Enter username" />
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input name="password" type="password" required placeholder="Enter password" />
            </div>
  
            <div className={styles.inputGroup}>
              <label htmlFor="role">Role</label>
              <select name="role" required>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="project manager">Project Manager</option>
                <option value="user">User</option>
              </select>
            </div>
  
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }