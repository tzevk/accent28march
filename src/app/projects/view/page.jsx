'use client';
import React from 'react';
import Sidebar from '../../components/Sidebar';
import styles  from '../../styles/leads.module.css';
import ViewProject from '../../components/projects/ViewProjects';

export default function ViewProjectPage() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.content}>
        <h1 className={styles.title}>Project Details</h1>
        <ViewProject />
      </main>
    </div>
  );
}
