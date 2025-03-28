'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "../styles/dashboard.module.css";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [leadCounts, setLeadCounts] = useState({
    Open: 0,
    "Under Discussion": 0,
    Awaiting: 0,
    Awarded: 0,
    Closed: 0,
  });

  useEffect(() => {
    const fetchLeadCounts = async () => {
      try {
        const response = await fetch(`/api/leads/status?year=${selectedYear}`);
        if (!response.ok) throw new Error("Failed to fetch lead counts");
        const data = await response.json();
        setLeadCounts(data);
      } catch (error) {
        console.error("Error fetching lead counts:", error);
      }
    };

    fetchLeadCounts();
  }, [selectedYear]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <main className={styles.content}>
          {/* Year Filter */}
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${selectedYear === 2024 ? styles.activeTab : ""}`}
              onClick={() => setSelectedYear(2024)}
            >
              2024
            </button>
            <button
              className={`${styles.filterTab} ${selectedYear === 2025 ? styles.activeTab : ""}`}
              onClick={() => setSelectedYear(2025)}
            >
              2025
            </button>
          </div>

          {/* Lead Counts Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dashboardTable}>
              <thead>
                <tr>
                  <th>Open</th>
                  <th>Under Discussion</th>
                  <th>Awaiting</th>
                  <th>Awarded</th>
                  <th>Closed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{leadCounts.Open}</td>
                  <td>{leadCounts["Under Discussion"]}</td>
                  <td>{leadCounts.Awaiting}</td>
                  <td>{leadCounts.Awarded}</td>
                  <td>{leadCounts.Closed}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Widgets */}
          <div className={styles.widgets}>
          </div>
        </main>
      </div>
    </div>
  );
}