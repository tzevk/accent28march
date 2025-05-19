import { useState, useEffect } from "react";
import styles from "../styles/leads.module.css";
import axios from "axios";
import LeadModal from "../components/LeadModal";
import AddInquiryModal from "../components/AddInquiryModal";
import { useRouter } from "next/navigation";

const LeadsTable = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [filterField, setFilterField] = useState("");
    const [search, setSearch] = useState("");
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [companiesLoading, setCompaniesLoading] = useState(false);
  
    const [newInquiry, setNewInquiry] = useState({
      company_name: '',
      type: '',
      city: '',
      enquiry_date: '',
      enquiry_type: '',
      project_status: '',
      followup1_description: '',
    });
  
    const router = useRouter();
  
    const handleAddNew = () => setShowOptionModal(true);
  
    const handleOptionSelect = (option) => {
      setShowOptionModal(false);
      if (option === 'manual') {
        setSelectedLead(null);
        setNewInquiry({
          company_name: '',
          type: '',
          city: '',
          enquiry_date: '',
          enquiry_type: '',
          project_status: '',
          followup1_description: '',
        });
        setShowModal(true);
      } else if (option === 'photo') {
        alert("📸 Add from Photos is under development.");
      }
    };
  
    const handleEdit = (lead) => {
      setSelectedLead(lead);
      setNewInquiry({
        company_name: lead.company_name,
        type: lead.type,
        city: lead.city,
        enquiry_date: lead.enquiry_date?.split("T")[0] || '',
        enquiry_type: lead.enquiry_type,
        project_status: lead.project_status,
        followup1_description: lead.followup1_description,
      });
      setShowModal(true);
    };
  
    const handleSearch = () => {
      if (!filterField || search.trim() === "") {
        setLeads(allLeads);
        return;
      }
  
      const filtered = allLeads.filter((lead) => {
        const fieldValue = lead[filterField];
        return fieldValue && fieldValue.toString().toLowerCase().includes(search.toLowerCase());
      });
  
      setLeads(filtered);
    };
  
    const handleDelete = async (id) => {
      if (confirm("Are you sure you want to delete this inquiry?")) {
        try {
          await axios.delete(`/api/leads/${id}`);
          fetchLeads();
        } catch (error) {
          console.error("Error deleting lead:", error);
        }
      }
    };
  
    const handleInputChange = (e) => {
      setNewInquiry({ ...newInquiry, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (selectedLead) {
          await axios.put(`/api/leads/${selectedLead._id}`, newInquiry);
        } else {
          await axios.post("/api/leads", newInquiry);
        }
  
        setShowModal(false);
        setSelectedLead(null);
        setNewInquiry({
          company_name: '',
          type: '',
          city: '',
          enquiry_date: '',
          enquiry_type: '',
          project_status: '',
          followup1_description: '',
        });
        fetchLeads();
      } catch (error) {
        console.error("🚨 Error saving lead:", error);
      }
    };
  
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/leads/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      }
    };
  
    const fetchLeads = async () => {
      try {
        const response = await axios.get("/api/leads");
        setLeads(response.data);
        setAllLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLeads();
      fetchCompanies();
    }, []);
  
    return (
      <div className={styles.content}>
        <h1 className={styles.title}>Inquiry Listing</h1>
        <div className={styles.filterContainer}>
          <select
            className={styles.filterDropdown}
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="">Select Search Field</option>
            <option value="company_name">Company Name</option>
            <option value="type">Type</option>
            <option value="city">City</option>
            <option value="enquiry_type">Enquiry Type</option>
            <option value="project_status">Project Status</option>
          </select>
  
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter search keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
  
          <div className={styles.searchContainer}>
            <button className={styles.addButton} onClick={handleSearch}>🔍 Search</button>
          </div>
          <button className={styles.addButton} onClick={handleAddNew}>➕ Add Inquiry</button>
        </div>
  
        <AddInquiryModal
  show={showOptionModal}
  onSelect={handleOptionSelect}
  onCancel={() => setShowOptionModal(false)}
  onSuccess={() => {
    fetchLeads();              // Refetch leads after adding
    setShowOptionModal(false); // Close modal
  }}
/>
  
        <LeadModal
          show={showModal}
          lead={newInquiry}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setSelectedLead(null);
          }}
          companies={companies}
        />
  
        <div className={styles.tableContainer}>
          <div className={styles.scrollableTable}>
            <table className={styles.dashboardTable}>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Enquiry Date</th>
                  <th>Enquiry Type</th>
                  <th>Project Status</th>
                  <th>Follow-up</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr key={lead._id}>
                      <td>{lead.sr_no || index + 1}</td>
                      <td>{lead.company_name}</td>
                      <td>{lead.type}</td>
                      <td>{lead.city}</td>
                      <td>{lead.enquiry_date}</td>
                      <td>{lead.enquiry_type}</td>
                      <td>
  {lead.project_status}
  {["Completed"].includes(lead.project_status) && (
    <span className={styles.convertedTag}>✔ Project</span>
  )}
</td>
                      <td>{lead.followup1_description || '-'}</td>
                      <td>
  <div className={styles.actionButtons}>
    <button className={styles.editButton} onClick={() => handleEdit(lead)}>Edit</button>
    <button className={styles.deleteButton} onClick={() => handleDelete(lead._id)}>Delete</button>

    <button
      className={styles.convertButton}
      onClick={() => router.push(`/projects/add?leadId=${lead._id}`)}
      title="Convert this lead into a project"
      disabled={["Regretted", "Completed"].includes(lead.project_status)}
    >
      Convert to Project
    </button>
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center' }}>No Data Available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default LeadsTable;