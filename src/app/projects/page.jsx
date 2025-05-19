// File: app/projects/page.jsx
"use client";

import ProjectTable from "../components/ProjectsTable";
import styles from "../styles/leads.module.css";
import Sidebar from "../components/Sidebar";

export default function ProjectsPage() {
    return (
        <div className={styles.dashboard}>
          <Sidebar />
          <main className={styles.mainContent}>
            <div className="p-6">
              <ProjectTable />
            </div>
          </main>
        </div>
      );
}