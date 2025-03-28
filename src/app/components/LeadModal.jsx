import { useEffect, useRef, useState } from "react";
import styles from "../styles/leadModal.module.css";

const steps = ["Company Info", "Inquiry Details", "Follow-up"];

const LeadModal = ({ show, lead, onChange, onSubmit, onCancel }) => {
  const modalRef = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) {
      const handleEsc = (e) => e.key === "Escape" && onCancel();
      document.addEventListener("keydown", handleEsc);
      modalRef.current?.focus();
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [show]);

  if (!show) return null;

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);
  const isLastStep = step === steps.length - 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLastStep) {
      onSubmit(e);
    } else {
      nextStep();
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent} ref={modalRef} tabIndex="-1">
        <button className={styles.closeButton} onClick={onCancel}>
          &times;
        </button>

        <h2 className={styles.modalTitle}>
          {lead?._id ? "Edit Inquiry" : "Add New Inquiry"} – {steps[step]}
        </h2>

        <form onSubmit={handleSubmit} className={styles.formWrapper} noValidate>
          {step === 0 && (
            <>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={lead.company_name}
                  onChange={onChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inlineGroup}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <input
                    type="text"
                    name="type"
                    value={lead.type}
                    onChange={onChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={lead.city}
                    onChange={onChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className={styles.formGroup}>
                <label>Enquiry Date</label>
                <input
                  type="date"
                  name="enquiry_date"
                  value={lead.enquiry_date}
                  onChange={onChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inlineGroup}>
                <div className={styles.formGroup}>
                  <label>Enquiry Type</label>
                  <select
                    name="enquiry_type"
                    value={lead.enquiry_type}
                    onChange={onChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                    <option value="walk in">Walk In</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Project Status</label>
                  <input
                    type="text"
                    name="project_status"
                    value={lead.project_status}
                    onChange={onChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className={styles.formGroup}>
              <label>Follow-up Description</label>
              <textarea
                name="followup1_description"
                value={lead.followup1_description}
                onChange={onChange}
                className={styles.textarea}
                placeholder="Add any notes here..."
              />
            </div>
          )}

          <div className={styles.buttonContainer}>
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.cancelButton}
              >
                Back
              </button>
            )}
            <button type="submit" className={styles.submitButton}>
              {isLastStep ? "Save" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
