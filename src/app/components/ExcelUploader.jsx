// components/ExcelUploader.jsx
"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import styles from "../styles/addClient.module.css";

export default function ExcelUploader() {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setExcelData(jsonData);
  };

  const handleUpload = async () => {
    try {
      const res = await fetch("/api/clients/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excelData),
      });
      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className={styles.importContainer}>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
      {excelData.length > 0 && (
        <>
          <p>{fileName} loaded with {excelData.length} records.</p>
          <button onClick={handleUpload} className={styles.submitButton}>
            Import to Database
          </button>
          <div className={styles.preview}>
            <pre>{JSON.stringify(excelData.slice(0, 5), null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}