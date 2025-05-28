"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Shield, Settings, Share2, Layers, Clock } from "lucide-react";
import {
  Home,
  BarChart,
  ShoppingCart,
  LogOut,
  Users,
  UserPlus,
} from "lucide-react";
import styles from "../styles/sidebar.module.css";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isUserManagementPath = pathname.startsWith("/users") || pathname.startsWith("/roles") || pathname.startsWith("/profiles") || pathname.startsWith("/sharing") || pathname.startsWith("/groups") || pathname.startsWith("/login-history");

  const isLeadsPath = pathname.startsWith("/leads");
  const isProjectsPath = pathname.startsWith("/projects");

  const safeNavigate = (href) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userSection}>
        <div className={styles.userLogo}>
          <Users size={28} className={styles.userIcon} />
        </div>
        <span className={styles.username}>User</span>
      </div>

      <nav className={styles.primaryNav}>
        <div
          className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}
          onClick={() => safeNavigate("/dashboard")}
        >
          <Home size={20} className={styles.icon} />
          <span>Dashboard</span>
        </div>

        {!isLeadsPath && !isProjectsPath && (
          <>
            <div
              className={`${styles.navItem} ${pathname === "/leads" ? styles.active : ""}`}
              onClick={() => safeNavigate("/leads")}
            >
              <BarChart size={20} className={styles.icon} />
              <span>Leads</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/projects" ? styles.active : ""}`}
              onClick={() => safeNavigate("/projects")}
            >
              <ShoppingCart size={20} className={styles.icon} />
              <span>Projects</span>
            </div>

          </>
        )}

        {isLeadsPath && (
          <>
            <div
              className={`${styles.navItem} ${pathname === "/clients" ? styles.active : ""}`}
              onClick={() => safeNavigate("/clients")}
            >
              <UserPlus size={20} className={styles.icon} />
              <span>All Clients</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/clients/add" ? styles.active : ""}`}
              onClick={() => safeNavigate("/clients/add")}
            >
              <UserPlus size={20} className={styles.icon} />
              <span>Add Client</span>
            </div>

            <div className={styles.navItem} onClick={() => safeNavigate("/dashboard")}>
              ← Back to Main
            </div>
          </>
        )}

{isProjectsPath && (
  <>
    <div
      className={`${styles.navItem} ${pathname === "/projects" ? styles.active : ""}`}
      onClick={() => safeNavigate("/projects")}
    >
      <ShoppingCart size={20} className={styles.icon} />
      <span>All Projects</span>
    </div>

    <div
      className={`${styles.navItem} ${pathname === "/projects/add" ? styles.active : ""}`}
      onClick={() => safeNavigate("/projects/add")}
    >
      <ShoppingCart size={20} className={styles.icon} />
      <span>Add Project</span>
    </div>

    <div
      className={`${styles.navItem} ${pathname === "/projects/reports" ? styles.active : ""}`}
      onClick={() => safeNavigate("/projects/reports")}
    >
      <ShoppingCart size={20} className={styles.icon} />
      <span>Project Reports</span>
    </div>

    <div
      className={`${styles.navItem} ${pathname === "/projects/archive" ? styles.active : ""}`}
      onClick={() => safeNavigate("/projects/archive")}
    >
      <ShoppingCart size={20} className={styles.icon} />
      <span>Archived Projects</span>
    </div>

    <div className={styles.navItem} onClick={() => safeNavigate("/dashboard")}>
      ← Back to Main
    </div>
  </>
)}

{!isLeadsPath && !isProjectsPath && !isUserManagementPath && (
  <div
    className={`${styles.navItem} ${pathname === "/users" ? styles.active : ""}`}
    onClick={() => safeNavigate("/users")}
  >
    <Users size={20} className={styles.icon} />
    <span>Employee Management</span>
  </div>
)}

{isUserManagementPath && (
  <>
    <div
      className={`${styles.navItem} ${pathname === "/users" ? styles.active : ""}`}
      onClick={() => safeNavigate("/users")}
    >
      <Users size={20} className={styles.icon} />
      <span>Employees</span>
    </div>

    <div
      className={`${styles.navItem} ${pathname === "/profile" ? styles.active : ""}`}
      onClick={() => safeNavigate("/profile")}
    >
      <Users size={20} className={styles.icon} />
      <span>Profiles</span>
    </div>

    <div
      className={`${styles.navItem} ${pathname === "/login-history" ? styles.active : ""}`}
      onClick={() => safeNavigate("/login-history")}
    >
      <Users size={20} className={styles.icon} />
      <span>Login History</span>
    </div>

    <div className={styles.navItem} onClick={() => safeNavigate("/dashboard")}>
      ← Back to Main
    </div>
  </>
)}
      </nav>

      <div className={styles.divider}></div>

      <div className={`${styles.navItem} ${styles.logout}`} onClick={() => safeNavigate("/login")}>
        <LogOut size={20} />
        <span>Sign Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;