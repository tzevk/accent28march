// File: components/ProjectTable.jsx
import { useState, useEffect } from "react";
import styles from "../styles/leads.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectModal from "./ProjectModal";

export default function ProjectTable() {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const router            = useRouter();

  /* map doc → row */
  const toRow = (doc) => {
    const s = doc.Sr ?? {};
    const pick = (k) => s[k] ?? doc[k] ?? '-';

    return {
      _id         : doc._id,
      projectId   : doc.projectId,
      year        : pick('Year'),
      number      : pick('Project No'),
      company     : pick('Company Name'),
      city        : pick('City'),
      mode        : pick('Project Mode'),
      start       : pick('Start Date'),
      endPlan     : pick('End Date'),
      endActual   : pick('Date of Completion'),
      status      : pick('Project Status'),
      execMode    : pick("Inhouse/ Outsource /Client's Office"),
      outsourced  : pick('Outsorced Company'),
      billing     : pick('Billing status'),
      
      remarks     : s.Remarks || '-'
    };
  };

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/projects');
        setRows(data.map(toRow));
      } catch (e) {
        console.error(e);
      } finally {
        setL(false);
      }
    })();
  }, []);

  /* actions */
  const add   = ()    => router.push('/projects/add');
  const view  = (r)   => router.push(`/projects/view?projectId=${r._id}`);
  const edit  = (r)   => router.push(`/projects/edit?projectId=${r._id}`);
  const del   = async (id) => {
    if (!confirm('Delete this project?')) return;
    await axios.delete(`/api/projects/${id}`);
    setRows(r=>r.filter(x=>x._id!==id));
  };

  /* ui */
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Project Listing</h1>

      <div className={styles.filterContainer}>
        <button className={styles.addButton} onClick={add}>➕ Add Project</button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.scrollableTable}>
          <table className={styles.dashboardTable}>
            <thead>
              <tr>
                <th>Year</th><th>No.</th><th>Client</th>
                <th>Start</th><th>Planned End</th><th>Actual End</th>
                <th>Status</th><th>Billing</th><th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="14" style={{textAlign:'center'}}>Loading…</td></tr>
              ) : rows.length ? (
                rows.map((r,i)=>(
                  <tr key={r._id}>
                    <td>{r.year}</td>
                    <td>{r.number}</td>
                    <td>{r.company}</td>
                    <td>{r.start}</td>
                    <td>{r.endPlan}</td>
                    <td>{r.endActual}</td>
                    <td>{r.status}</td>
                    <td>{r.billing}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.viewButton}   onClick={()=>view(r)}>View</button>
                        <button className={styles.editButton}   onClick={()=>edit(r)}>Edit</button>
                        <button className={styles.deleteButton} onClick={()=>del(r._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="14" style={{textAlign:'center'}}>No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}