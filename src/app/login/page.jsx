'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/login.module.css';

export default function LoginPage() {
  const router             = useRouter();
  const [error, setError]  = useState('');
  const [loading, setLoad] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoad(true);

    const email    = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const role     = e.target.role.value;

    try {
      const res = await fetch('/api/auth/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email, password, role }),   // 👈 pass role too
        credentials: 'include'                                // receive cookie
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || 'Login failed');
      } else {
        /* ---------- optional localStorage backup ---------- */
        // localStorage.setItem('token', body.token); // token now in cookie
        localStorage.setItem('role', body.role);

        /* ---------- role-based redirect ---------- */
        if (body.role === 'admin')            router.push('/dashboard');
        else if (body.role === 'project manager')
                                              router.push('/dashboard/manager');
        else                                  router.push('/dashboard/user');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
    setLoad(false);
  }

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
            <label>Email</label>
            <input name="email" type="email" required placeholder="Enter email" />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input name="password" type="password" required placeholder="Enter password" />
          </div>

          <div className={styles.inputGroup}>
            <label>Role</label>
            <select name="role" required defaultValue="">
              <option value="" disabled>Select Role</option>
              <option value="admin">Admin</option>
              <option value="project manager">Project Manager</option>
              <option value="user">User</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}