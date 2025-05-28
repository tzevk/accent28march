'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/login.module.css';
import { signIn } from 'next-auth/react';

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
    const role = e.target.role.value.toUpperCase();
    

const result = await signIn('credentials', {
  redirect: false,
  email,
  password,
  role,
});

    if (result.error) {
      setError(result.error);
    } else {
      const roleStored = localStorage.getItem('role');
      if (roleStored === 'admin') router.push('/dashboard');
      else if (roleStored === 'project manager') router.push('/dashboard/manager');
      else router.push('/dashboard/user');
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
  <option value="ADMIN">Admin</option>
  <option value="PROJECT MANAGER">Project Manager</option>
  <option value="USER">User</option>
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