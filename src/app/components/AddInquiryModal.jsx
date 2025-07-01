import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/leadModal.module.css";
import axios from "axios";
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Activity,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

const AddInquiryModal = ({ show, onCancel, onSuccess }) => {
    const modalRef = useRef(null);
    const [companies, setCompanies] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      company_name: "",
      type: "",
      city: "",
      enquiry_date: "",
      enquiry_type: "",
      project_status: "",
      followup1_description: "",
    });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
  
    useEffect(() => {
      if (show) {
        const fetchCompanies = async () => {
          try {
            const res = await axios.get("/api/leads/companies");
            setCompanies(res.data);
          } catch (err) {
            console.error("Failed to fetch companies", err);
          }
        };
  
        fetchCompanies();
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, enquiry_date: today }));
  
        const handleEsc = (e) => e.key === "Escape" && onCancel();
        document.addEventListener("keydown", handleEsc);
        modalRef.current?.focus();
        return () => document.removeEventListener("keydown", handleEsc);
      }
    }, [show, onCancel]);

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
      if (!formData.type.trim()) newErrors.type = "Type is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.enquiry_date) newErrors.enquiry_date = "Enquiry date is required";
      if (!formData.enquiry_type) newErrors.enquiry_type = "Enquiry type is required";
      if (!formData.project_status) newErrors.project_status = "Project status is required";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      try {
        const response = await axios.post("/api/leads", formData);
        if (response.status === 201) {
          setShowSuccess(true);
          setTimeout(() => {
            onSuccess();
            setFormData({
              company_name: "",
              type: "",
              city: "",
              enquiry_date: "",
              enquiry_type: "",
              project_status: "",
              followup1_description: "",
            });
            setErrors({});
            setShowSuccess(false);
          }, 1500);
        }
      } catch (err) {
        console.error("Error submitting inquiry", err);
        setErrors({ submit: "Something went wrong while submitting. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    if (!show) return null;
  
    return (
      <div className={styles.modalOverlay} role="dialog" aria-modal="true">
        <div className={styles.modalContent} ref={modalRef} tabIndex="-1">
          <button 
            className={styles.closeButton} 
            onClick={onCancel}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
  
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Add New Inquiry</h2>
            <p className={styles.modalSubtitle}>Fill in the details to create a new lead inquiry</p>
          </div>

          {showSuccess && (
            <div className={styles.successBanner}>
              <CheckCircle size={20} />
              <span>Inquiry added successfully!</span>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className={styles.formWrapper}>
            {/* Company Name */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Building2 size={18} />
                Company Information
              </h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <select
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.company_name ? styles.inputError : ''}`}
                    required
                  >
                    <option value="">Select or type company name</option>
                    {companies.map((company, index) => (
                      <option key={index} value={company.company_name}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                  {errors.company_name && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.company_name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FileText size={18} />
                Project Details
              </h3>
              
              <div className={styles.inlineGroup}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Project Type <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.type ? styles.inputError : ''}`}
                      placeholder="e.g., Residential, Commercial"
                      required
                    />
                    {errors.type && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        {errors.type}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MapPin size={16} />
                    City <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                      placeholder="Enter city name"
                      required
                    />
                    {errors.city && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <MessageSquare size={18} />
                Enquiry Information
              </h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Calendar size={16} />
                  Enquiry Date <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="date"
                    name="enquiry_date"
                    value={formData.enquiry_date}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.enquiry_date ? styles.inputError : ''}`}
                    required
                  />
                  {errors.enquiry_date && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.enquiry_date}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inlineGroup}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Enquiry Source <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <select
                      name="enquiry_type"
                      value={formData.enquiry_type}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.enquiry_type ? styles.inputError : ''}`}
                      required
                    >
                      <option value="">Select enquiry source</option>
                      <option value="Email">📧 Email</option>
                      <option value="Call">📞 Phone Call</option>
                      <option value="Walk In">🚶 Walk In</option>
                      <option value="Referral">👥 Referral</option>
                      <option value="Website">🌐 Website</option>
                      <option value="Social Media">📱 Social Media</option>
                      <option value="Others">📋 Others</option>
                    </select>
                    {errors.enquiry_type && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        {errors.enquiry_type}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Activity size={16} />
                    Project Status <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <select
                      name="project_status"
                      value={formData.project_status}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.project_status ? styles.inputError : ''}`}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Open">🔄 Open</option>
                      <option value="Under Discussion">💬 Under Discussion</option>
                      <option value="Awaiting">⏳ Awaiting Response</option>
                      <option value="Planning">📋 Planning</option>
                      <option value="On Hold">⏸️ On Hold</option>
                    </select>
                    {errors.project_status && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        {errors.project_status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up Notes */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FileText size={18} />
                Additional Notes
              </h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Follow-up Notes (Optional)</label>
                <div className={styles.inputWrapper}>
                  <textarea
                    name="followup1_description"
                    value={formData.followup1_description}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Add any additional notes, requirements, or follow-up reminders..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className={styles.errorBanner}>
                <AlertCircle size={20} />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.buttonContainer}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className={styles.spinning} />
                    <span>Adding Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Add Inquiry</span>
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={onCancel} 
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default AddInquiryModal;