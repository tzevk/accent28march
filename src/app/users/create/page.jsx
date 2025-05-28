"use client";
import React from "react";
import CreateUserPage from '../../components/CreateUserPage';
import Sidebar from "../../components/Sidebar";
import styles from "../../styles/leads.module.css";

export default function LeadsPage() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="p-6">
          <CreateUserPage />
        </div>
      </main>
    </div>
  );
}