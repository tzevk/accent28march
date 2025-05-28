'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import styles from "../../styles/addClient.module.css";
import Sidebar from '../../components/Sidebar';
import axios from 'axios'; 
/* ---------- helper ---------- */
const genProjectNumber = () => {
  const y   = new Date().getFullYear();
  const rnd = Math.floor(100 + Math.random() * 900); // 3-digit
  return `PRJ-${y}-${rnd}`;
};

/* ---------- component ---------- */
export default function AddProjectPage() {
  const router = useRouter();
  const [tab , setTab ] = useState('basic');
  const [busy, setBusy] = useState(false);

  const [f, setF] = useState({
    projectNumber : genProjectNumber(),

    /* ─ basic ─ */
    companyName   : '',
    city          : '',
    mode          : '',      // Awarded / New …
    projectName   : '',
    startDate     : new Date().toISOString().slice(0,10),
    endDate       : '',
    targetDate    : '',
    completion    : '',

    /* ─ status & assignment ─ */
    progress      : '',
    status        : '',
    execMode      : '',      // In-house / Outsource / Client Office
    outsourcedCo  : '',
    billing       : '',
    remarks       : '',
    assignedTo    : ''
  });

  const h = e => setF({ ...f, [e.target.name]: e.target.value });

  /* ---------- submit ---------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      const res   = await fetch('/api/projects/add', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify(f)
      });
      const data  = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      alert(`✅ Saved – ID ${data.projectId}`);
      router.push('/projects');
    } catch (err) {
      alert(`❌ ${err.message}`);
      console.error(err);
    }
    setBusy(false);
  };

  /* ---------- render ---------- */
  return (
    <div className={styles.clientsPage}>
      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.contentArea}>

          {/* ─ tabs ─ */}
          <div className={styles.tabControls}>
            <button onClick={()=>setTab('basic')}
                    className={tab==='basic'?styles.activeTab:''}>Basic Info</button>
            <button onClick={()=>setTab('status')}
                    className={tab==='status'?styles.activeTab:''}>Status & Assignment</button>
          </div>

          {/* ─ form ─ */}
          <form id="projectForm" onSubmit={handleSubmit} className={styles.editForm}>
            {tab==='basic' && (
              <div className={styles.formSection}>
                <h4>Project Details</h4>
                <div className={styles.formGrid}>

                  <label>Project&nbsp;Number
                    <input name="projectNumber" value={f.projectNumber} readOnly/>
                  </label>

                  <label>Company&nbsp;Name
                    <input name="companyName" value={f.companyName} onChange={h} required/>
                  </label>

                  <label>City
                    <input name="city" value={f.city} onChange={h}/>
                  </label>

                  <label>Project&nbsp;Mode
                    <select name="mode" value={f.mode} onChange={h}>
                      <option value="">— select —</option>
                      <option>Awarded</option><option>New</option><option>Ongoing</option>
                    </select>
                  </label>

                  <label>Project&nbsp;Name / Description
                    <input name="projectName" value={f.projectName} onChange={h}/>
                  </label>

                  <label>Start&nbsp;Date
                    <input type="date" name="startDate" value={f.startDate} onChange={h}/>
                  </label>

                  <label>End&nbsp;Date
                    <input type="date" name="endDate" value={f.endDate} onChange={h}/>
                  </label>

                  <label>Date&nbsp;of&nbsp;Completion
                    <input type="date" name="completion" value={f.completion} onChange={h}/>
                  </label>

                  <label>Target&nbsp;Date
                    <input type="date" name="targetDate" value={f.targetDate} onChange={h}/>
                  </label>

                </div>
              </div>
            )}

            {tab==='status' && (
              <div className={styles.formSection}>
                <h4>Status & Assignment</h4>
                <div className={styles.formGrid}>

                  <label>Progress&nbsp;(%)<input name="progress" type="number"
                         min="0" max="100" value={f.progress} onChange={h}/></label>

                  <label>Status
                    <select name="status" value={f.status} onChange={h}>
                      <option value="">— select —</option>
                      <option>Ongoing</option><option>Completed</option><option>On Hold</option>
                    </select>
                  </label>

                  <label>Execution&nbsp;Mode
                    <select name="execMode" value={f.execMode} onChange={h}>
                      <option value="">— select —</option>
                      <option>In-house</option><option>Client Office</option><option>Outsource </option>
                    </select>
                  </label>

                  <label>Outsourced&nbsp;Company
                    <input name="outsourcedCo" value={f.outsourcedCo} onChange={h}/>
                  </label>

                  <label>Billing&nbsp;Status
                    <input name="billing" value={f.billing} onChange={h}/>
                  </label>

                  <label>Remarks
                    <textarea name="remarks" value={f.remarks} onChange={h}/>
                  </label>

                  <label>Assigned&nbsp;To
                    <select name="assignedTo" value={f.assignedTo} onChange={h}>
                      <option value="">— select —</option>
                      <option>Tanvi Kadam</option>
                    </select>
                  </label>

                </div>
              </div>
            )}
          </form>

          {/* ─ buttons ─ */}
          <div className={styles.buttonRow}>
            <button type="button" onClick={()=>router.push('/projects')}>Cancel</button>
            <button type="submit" form="projectForm" disabled={busy}>
              {busy?'Saving…':'Save Project'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}