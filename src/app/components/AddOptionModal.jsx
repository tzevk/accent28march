"use client";

import styles from "../styles/AddOptionModal.module.css";

const AddOptionModal = ({ show, onSelect, onCancel }) => {
  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Choose Input Method</h2>
        <div className={styles.modalButtons}>
          <button
            className={styles.modalButton}
            onClick={() => onSelect("photo")}
          >
            📸 Add from Photos
          </button>
          <button
            className={styles.modalButton}
            onClick={() => onSelect("manual")}
          >
            📝 Add Manually
          </button>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;