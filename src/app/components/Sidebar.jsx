"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import link from "next/link";
import {
  Home,
  BarChart,
  ShoppingCart,
  HelpCircle,
  Settings,
  LogOut,
  Users,
  UserPlus,
  FileText,
} from "lucide-react";
import styles from "../styles/sidebar.module.css";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

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


            <div
              className={`${styles.navItem} ${pathname === "/settings" ? styles.active : ""}`}
              onClick={() => safeNavigate("/settings")}
            >
              <Settings size={20} className={styles.icon} />
              <span>Settings</span>
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

            <div
              className={`${styles.navItem} ${pathname === "/leads/reports/sales" ? styles.active : ""}`}
              onClick={() => safeNavigate("/leads/reports/sales")}
            >
              <FileText size={20} className={styles.icon} />
              <span>Sales Report</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/leads/reports/users" ? styles.active : ""}`}
              onClick={() => safeNavigate("/leads/reports/users")}
            >
              <FileText size={20} className={styles.icon} />
              <span>User Report</span>
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