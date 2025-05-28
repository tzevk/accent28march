'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/leads.module.css';
import Sidebar from '../Sidebar';
import axios from 'axios';

export default function ProjectView() {
  const [proj, setProj] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    if (!projectId) {
      router.push('/projects');
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(`/api/projects/${projectId}`);
        setProj(data);
      } catch (e) {
        console.error(e);
        alert('Failed to load project details');
      }
    })();
  }, [projectId, router]);

  if (!proj) return <p style={{ padding: 20 }}>Loading…</p>;

  const s = proj.Sr || {};

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.content}>
        {/* ---------- DETAILS CARDS ---------- */}
        <section className={styles.card}>
          <h3>Basic Information</h3>
          <table className={styles.detailTable}>
            <tbody>
              {[
                { label: 'Project No.', value: s['Project No'] },
                { label: 'Project Name', value: s['Project Description'] },
                { label: 'Company', value: s['Company Name'] },
                { label: 'City', value: s['City'] },
                { label: 'Project Mode', value: s['Project Mode'] },
              ].map(({ label, value }) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ---------- Card 2 : Dates ---------- */}
        <section className={styles.card}>
          <h3>Dates</h3>
          <table className={styles.detailTable}>
            <tbody>
              {[
                { label: 'Start Date', value: s['Start Date'] },
                { label: 'Planned End', value: s['End Date'] },
                { label: 'Target Date', value: s['Target Date'] },
                { label: 'Completion', value: s['Date of Completion'] },
              ].map(({ label, value }) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ---------- Card 3 : Status ---------- */}
        <section className={styles.card}>
          <h3>Status &amp; Assignment</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <th>Status</th>
                <td>{s['Project Status']}</td>
              </tr>
              <tr>
                <th>Progress (%)</th>
                <td>{s['Progress'] || '—'}</td>
              </tr>
              <tr>
                <th>Assigned To</th>
                <td>{s['Assigned To'] || '—'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ---------- Card 4 : Execution ---------- */}
        <section className={styles.card}>
          <h3>Execution &amp; Billing</h3>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <th>Execution Mode</th>
                <td>{s['Placement']}</td>
              </tr>
              <tr>
                <th>Outsourced Co.</th>
                <td>{s['Outsorced Company'] || '—'}</td>
              </tr>
              <tr>
                <th>Billing Status</th>
                <td>{s['Billing status'] || '—'}</td>
              </tr>
              <tr>
                <th>Remarks</th>
                <td>{s['Remarks'] || '—'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ---------- Actions ---------- */}
        <div className={styles.actions}>
          <button onClick={() => router.push('/projects')}>← Back to Projects</button>
        </div>
      </main>
    </div>
  );
}