"use client";
import LeadsTable from "../components/LeadsTable";
import Sidebar from "../components/Sidebar";
import styles from "../styles/leads.module.css";

export default function LeadsPage() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <main className={styles.content}>
          <LeadsTable />
        </main>
      </div>
    </div>
  );
}