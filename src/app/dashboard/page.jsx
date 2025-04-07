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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString; // fallback to raw string
    return parsedDate.toLocaleDateString("en-GB"); // "dd/mm/yyyy"
  };

  const [outreachData, setOutreach] = useState([]);
  const [showOutreach, setShowOutreach] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = outreachData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(outreachData.length / rowsPerPage);
  
    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };
  

  useEffect(() => {
    const fetchOutreach = async () => {
      try {
        const res = await fetch("/api/outreach");
        const data = await res.json();
        setOutreach(data);
      } catch (err) {
        console.error("Error loading outreach data", err);
      }
    };
    fetchOutreach();
  }, []);

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
          <div className={styles.outreachButtonContainer}>
  <button
    onClick={() => setShowOutreach(!showOutreach)}
    className={styles.outreachToggleButton}
  >
    {showOutreach ? "Hide Outreach Tracker" : "Show Outreach Tracker"}
  </button>
</div>
{showOutreach && (
 <div className={styles.outreachTableWrapper}>
  
 <div className={styles.tableContainer}>
   <table className={styles.outreachTable}>
     <thead>
       <tr>
         <th>Company</th>
         <th>Follow-up Date</th>
         <th>Description</th>
       </tr>
     </thead>
   </table>

  
   <div className={styles.scrollBody}>
     <table className={styles.outreachTable}>
       <tbody>
         {outreachData.length > 0 ? (
           outreachData.map((entry, index) => (
             <tr key={index}>
               <td>{entry.company_name}</td>
               <td>{formatDate(entry.followup1_date)}</td>
               <td>{entry.followup1_description}</td>
             </tr>
           ))
         ) : (
           <tr>
             <td colSpan="3" className={styles.noData}>No outreach data available</td>
           </tr>
         )}
       </tbody>
     </table>
   </div>
 </div>
</div>
)}
        </main>
      </div>
    </div>
  );
}