'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!project) return <p>Loading project details…</p>;

  const sr = project.Sr;
  const manpower = parseInt(sr["Manpower"]) || 0;
  const duration = 8; // Hardcoded for now or fetch from DB
  const manhours = manpower * 8 * duration;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📁 Project Details</h1>
      <p><strong>Project No:</strong> {sr["Project No"]}</p>
      <p><strong>Company:</strong> {sr["Company Name"]}</p>
      <p><strong>City:</strong> {sr["City"]}</p>
      <p><strong>Status:</strong> {sr["Project Status"]}</p>
      <p><strong>Manpower:</strong> {manpower}</p>

      <h3>🧠 Calculated Manhours</h3>
      <p>{manpower} × 8 × {duration} = <strong>{manhours} manhours</strong></p>
    </div>
  );
}