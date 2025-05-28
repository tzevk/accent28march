'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/leads.module.css';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
export default function ProjectView() {
  const sp         = useSearchParams();
  const projectId  = sp.get('projectId');
  const [proj , setProj ] = useState(null);
  const router     = useRouter();

  /* fetch once */
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const { data } = await axios.get(`/api/projects/${projectId}`);
        setProj(data);
      } catch (err) {
        console.error('Error fetching project', err);
      }
    })();
  }, [projectId]);

  if (!proj) return <p style={{padding:20}}>Loading…</p>;

  const s = proj.Sr || {};

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.content}>
      {/* ---------- DETAILS CARDS ---------- */}
      <div className={styles.cardsGrid /* same two-col grid */}>

        {/* --- Card 1 : Basic --- */}
        <section className={styles.card}>
          <h3>Basic Information</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr><th>Project ID</th>      
              <td>{proj.projectId}</td></tr>
              <tr><th>Project No.</th>     
              <td>{s['Project No']}</td></tr>
              <tr><th>Project Name</th>   
              <td>{s['Project Description']}</td></tr>
              <tr><th>Company</th>         
              <td>{s['Company Name']}</td></tr>
              <tr><th>City</th>            
              <td>{s['City']}</td></tr>
              <tr><th>Project Mode</th>    
              <td>{s['Project Mode']}</td></tr>
            </tbody>
          </table>
        </section>

        {/* --- Card 2 : Dates --- */}
        <section className={styles.card}>
          <h3>Dates</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr><th>Start Date</th>      <td>{s['Start Date']}</td></tr>
              <tr><th>Planned End</th>     <td>{s['End Date']}</td></tr>
              <tr><th>Target Date</th>     <td>{s['Target Date']}</td></tr>
              <tr><th>Completion</th>      <td>{s['Date of Completion']}</td></tr>
            </tbody>
          </table>
        </section>

        {/* --- Card 3 : Status --- */}
        <section className={styles.card}>
          <h3>Status &amp; Assignment</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr><th>Status</th>          <td>{s['Project Status']}</td></tr>
              <tr><th>Progress (%)</th>    <td>{s['Progress'] || '—'}</td></tr>
              <tr><th>Assigned To</th>     <td>{s['Assigned To'] || '—'}</td></tr>
            </tbody>
          </table>
        </section>

        {/* --- Card 4 : Execution --- */}
        <section className={styles.card}>
          <h3>Execution &amp; Billing</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr><th>Execution Mode</th>  <td>{s['Placement']}</td></tr>
              <tr><th>Outsourced Co.</th>  <td>{s['Outsorced Company'] || '—'}</td></tr>
              <tr><th>Billing Status</th>  <td>{s['Billing status'] || '—'}</td></tr>
              <tr><th>Remarks</th>         <td>{s['Remarks'] || '—'}</td></tr>
            </tbody>
          </table>
        </section>

      </div>{/* /cardsGrid */}

      {/* ---------- actions ---------- */}
      <div className={styles.actions}>
        <button onClick={() => router.push('/projects')}>← Back to Projects</button>
      </div>
    </main>
    </div>
  );
}