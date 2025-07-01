"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Shield, Settings, Share2, Layers, Clock } from "lucide-react";
import {
  Home,
  BarChart,
  ShoppingCart,
  LogOut,
  Users,
  UserPlus,
  Building2,
  FolderOpen,
  PlusCircle,
  Archive,
  FileText,
  Activity,
  User,
  History
} from "lucide-react";
import styles from "../styles/sidebar.module.css";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState('');
  
  const isUserManagementPath = pathname.startsWith("/users") || pathname.startsWith("/roles") || pathname.startsWith("/profiles") || pathname.startsWith("/sharing") || pathname.startsWith("/groups") || pathname.startsWith("/login-history");
  const isLeadsPath = pathname.startsWith("/leads");
  const isProjectsPath = pathname.startsWith("/projects");

  useEffect(() => {
    // Get user role from localStorage or session
    const role = localStorage.getItem('role') || 'USER';
    setUserRole(role.toLowerCase());
  }, []);

  const safeNavigate = (href) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <img
              src="/accent.png"
              alt="Accent Logo"
              className={styles.logoImage}
              width={28}
              height={28}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Accent</span>
            <span className={styles.brandTagline}>CRM</span>
          </div>
        </div>
        
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={16} className={styles.userIcon} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.greeting}>{getGreeting()}</span>
              <span className={styles.username}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.navSection}>
          <span className={styles.sectionLabel}>Main</span>
          
          <div
            className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}
            onClick={() => safeNavigate("/dashboard")}
          >
            <Home size={18} className={styles.icon} />
            <span>Dashboard</span>
          </div>

          {!isLeadsPath && !isProjectsPath && (
            <>
              <div
                className={`${styles.navItem} ${pathname === "/leads" ? styles.active : ""}`}
                onClick={() => safeNavigate("/leads")}
              >
                <Activity size={18} className={styles.icon} />
                <span>Leads</span>
                <div className={styles.badge}>12</div>
              </div>

              <div
                className={`${styles.navItem} ${pathname === "/projects" ? styles.active : ""}`}
                onClick={() => safeNavigate("/projects")}
              >
                <FolderOpen size={18} className={styles.icon} />
                <span>Projects</span>
                <div className={styles.badge}>8</div>
              </div>
            </>
          )}
        </div>

        {isLeadsPath && (
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>Leads Management</span>
            
            <div
              className={`${styles.navItem} ${pathname === "/clients" ? styles.active : ""}`}
              onClick={() => safeNavigate("/clients")}
            >
              <Building2 size={18} className={styles.icon} />
              <span>All Clients</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/clients/add" ? styles.active : ""}`}
              onClick={() => safeNavigate("/clients/add")}
            >
              <PlusCircle size={18} className={styles.icon} />
              <span>Add Client</span>
            </div>

            <div className={styles.backButton} onClick={() => safeNavigate("/dashboard")}>
              <ChevronRight size={16} className={styles.backIcon} />
              <span>Back to Main</span>
            </div>
          </div>
        )}

        {isProjectsPath && (
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>Projects Management</span>
            
            <div
              className={`${styles.navItem} ${pathname === "/projects" ? styles.active : ""}`}
              onClick={() => safeNavigate("/projects")}
            >
              <FolderOpen size={18} className={styles.icon} />
              <span>All Projects</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/projects/add" ? styles.active : ""}`}
              onClick={() => safeNavigate("/projects/add")}
            >
              <PlusCircle size={18} className={styles.icon} />
              <span>Add Project</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/projects/reports" ? styles.active : ""}`}
              onClick={() => safeNavigate("/projects/reports")}
            >
              <FileText size={18} className={styles.icon} />
              <span>Project Reports</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/projects/archive" ? styles.active : ""}`}
              onClick={() => safeNavigate("/projects/archive")}
            >
              <Archive size={18} className={styles.icon} />
              <span>Archived Projects</span>
            </div>

            <div className={styles.backButton} onClick={() => safeNavigate("/dashboard")}>
              <ChevronRight size={16} className={styles.backIcon} />
              <span>Back to Main</span>
            </div>
          </div>
        )}

        {!isLeadsPath && !isProjectsPath && !isUserManagementPath && (
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>Administration</span>
            
            <div
              className={`${styles.navItem} ${pathname === "/users" ? styles.active : ""}`}
              onClick={() => safeNavigate("/users")}
            >
              <Users size={18} className={styles.icon} />
              <span>Employee Management</span>
            </div>
          </div>
        )}

        {isUserManagementPath && (
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>User Management</span>
            
            <div
              className={`${styles.navItem} ${pathname === "/users" ? styles.active : ""}`}
              onClick={() => safeNavigate("/users")}
            >
              <Users size={18} className={styles.icon} />
              <span>Employees</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/profile" ? styles.active : ""}`}
              onClick={() => safeNavigate("/profile")}
            >
              <User size={18} className={styles.icon} />
              <span>Profiles</span>
            </div>

            <div
              className={`${styles.navItem} ${pathname === "/login-history" ? styles.active : ""}`}
              onClick={() => safeNavigate("/login-history")}
            >
              <History size={18} className={styles.icon} />
              <span>Login History</span>
            </div>

            <div className={styles.backButton} onClick={() => safeNavigate("/dashboard")}>
              <ChevronRight size={16} className={styles.backIcon} />
              <span>Back to Main</span>
            </div>
          </div>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.divider}></div>
        
        <div className={`${styles.navItem} ${styles.logout}`} onClick={() => safeNavigate("/login")}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;