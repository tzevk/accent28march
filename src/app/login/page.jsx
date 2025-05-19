'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    const email = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const role = e.target.role.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.role === role) {
        // Store token in localStorage or cookie
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Redirect based on role
        if (data.role === 'admin') router.push('/dashboard/admin');
        else if (data.role === 'project manager') router.push('/dashboard/manager');
        else router.push('/dashboard/user');
      } else {
        setError('Invalid credentials or role mismatch');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong.');
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
            <label htmlFor="username">Email</label>
            <input name="username" type="text" required placeholder="Enter email" />
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