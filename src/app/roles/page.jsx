'use client';

import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import styles from '../styles/leads.module.css';

const RoleTree = dynamic(() => import('../components/RoleTree'), { ssr: false });


export default function RolesPage() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <RoleTree />
      </main>
    </div>
  );
}