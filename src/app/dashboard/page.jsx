'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "../styles/dashboard.module.css";
import { Calendar, TrendingUp, Users, Award, Clock, ChevronDown, Eye, EyeOff } from "lucide-react";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [leadCounts, setLeadCounts] = useState({
    Open: 0,
    "Under Discussion": 0,
    Awaiting: 0,
    Awarded: 0,
    Closed: 0,
  });
  const [outreachData, setOutreach] = useState([]);
  const [showOutreach, setShowOutreach] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;
    return parsedDate.toLocaleDateString("en-GB");
  };

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

  // Calculate total leads
  const totalLeads = Object.values(leadCounts).reduce((sum, count) => sum + count, 0);

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchOutreach = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/outreach");
        const data = await res.json();
        setOutreach(data);
      } catch (err) {
        console.error("Error loading outreach data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOutreach();
  }, []);

  useEffect(() => {
    const fetchLeadCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/status?year=${selectedYear}`);
        if (!response.ok) throw new Error("Failed to fetch lead counts");
        const data = await response.json();
        setLeadCounts(data);
      } catch (error) {
        console.error("Error fetching lead counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadCounts();
  }, [selectedYear]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <main className={styles.content}>
          {/* Header Section */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>
                {getGreeting()}! 👋
              </h1>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.dateInfo}>
                <Calendar size={20} />
                <span>{new Date().toLocaleDateString("en-GB")}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{totalLeads}</h3>
                <p className={styles.statLabel}>Total Leads</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Award size={24} />
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{leadCounts.Awarded}</h3>
                <p className={styles.statLabel}>Awarded Projects</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{leadCounts["Under Discussion"]}</h3>
                <p className={styles.statLabel}>Under Discussion</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={24} />
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{outreachData.length}</h3>
                <p className={styles.statLabel}>Active Outreach</p>
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div className={styles.filterSection}>
            <h2 className={styles.sectionTitle}>Lead Status Overview</h2>
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
          </div>

          {/* Lead Status Table */}
          <div className={styles.tableCard}>
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
                    <td className={styles.openCell}>{leadCounts.Open}</td>
                    <td className={styles.discussionCell}>{leadCounts["Under Discussion"]}</td>
                    <td className={styles.awaitingCell}>{leadCounts.Awaiting}</td>
                    <td className={styles.awardedCell}>{leadCounts.Awarded}</td>
                    <td className={styles.closedCell}>{leadCounts.Closed}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Outreach Section */}
          <div className={styles.outreachSection}>
            <button
              onClick={() => setShowOutreach(!showOutreach)}
              className={styles.outreachToggleButton}
            >
              <span>Outreach Tracker</span>
              {showOutreach ? <EyeOff size={20} /> : <Eye size={20} />}
              <ChevronDown 
                size={20} 
                className={`${styles.chevron} ${showOutreach ? styles.chevronRotated : ""}`}
              />
            </button>

            {showOutreach && (
              <div className={styles.outreachCard}>
                <div className={styles.outreachHeader}>
                  <h3>Active Outreach Campaigns</h3>
                  <span className={styles.outreachCount}>
                    {outreachData.length} active campaigns
                  </span>
                </div>
                
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
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="3" className={styles.loadingCell}>
                              <div className={styles.loader}></div>
                              Loading...
                            </td>
                          </tr>
                        ) : outreachData.length > 0 ? (
                          outreachData.map((entry, index) => (
                            <tr key={index}>
                              <td className={styles.companyCell}>{entry.company_name}</td>
                              <td className={styles.dateCell}>{formatDate(entry.followup1_date)}</td>
                              <td className={styles.descriptionCell}>{entry.followup1_description}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className={styles.noData}>
                              No outreach data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}