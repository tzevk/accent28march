import { useState, useEffect } from "react";
import styles from "../styles/leads.module.css";
import axios from "axios";
import LeadModal from "../components/LeadModal";
import AddInquiryModal from "../components/AddInquiryModal";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Filter,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  CheckCircle,
  RefreshCw
} from "lucide-react";

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
   const ordered = [...response.data].reverse();   
   setLeads(ordered);
   setAllLeads(ordered);
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
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Lead Management</h1>
            <p className={styles.subtitle}>Track and manage your sales inquiries</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.addButton} onClick={handleAddNew}>
              <Plus size={20} />
              <span>Add Inquiry</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className={styles.filtersCard}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <Filter size={18} className={styles.filterIcon} />
              <select
                className={styles.filterDropdown}
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="">All Fields</option>
                <option value="company_name">Company Name</option>
                <option value="type">Type</option>
                <option value="city">City</option>
                <option value="enquiry_type">Enquiry Type</option>
                <option value="project_status">Project Status</option>
              </select>
            </div>

            <div className={styles.searchGroup}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.searchButton} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{leads.length}</span>
              <span className={styles.statLabel}>Total Leads</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {leads.filter(lead => lead.project_status === "Completed").length}
              </span>
              <span className={styles.statLabel}>Converted</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {leads.filter(lead => lead.project_status === "Under Discussion").length}
              </span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </div>
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
  
        {/* Table Section */}
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.modernTable}>
              <thead>
                <tr>
                  <th>
                    <div className={styles.tableHeader}>
                      <span>#</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <Building2 size={16} />
                      <span>Company</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <FileText size={16} />
                      <span>Type</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <MapPin size={16} />
                      <span>City</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <Calendar size={16} />
                      <span>Enquiry Date</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <MessageSquare size={16} />
                      <span>Enquiry Type</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <Activity size={16} />
                      <span>Status</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <MessageSquare size={16} />
                      <span>Follow-up</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className={styles.loadingCell}>
                      <div className={styles.loadingContent}>
                        <RefreshCw size={20} className={styles.spinner} />
                        <span>Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr key={lead._id} className={styles.tableRow}>
                      <td className={styles.indexCell}>
                        <span className={styles.indexNumber}>{lead.sr_no || index + 1}</span>
                      </td>
                      <td className={styles.companyCell}>
                        <div className={styles.companyInfo}>
                          <Building2 size={16} className={styles.cellIcon} />
                          <span className={styles.companyName}>{lead.company_name}</span>
                        </div>
                      </td>
                      <td className={styles.typeCell}>
                        <span className={styles.typeTag}>{lead.type}</span>
                      </td>
                      <td className={styles.cityCell}>
                        <div className={styles.cityInfo}>
                          <MapPin size={14} className={styles.cellIcon} />
                          <span>{lead.city}</span>
                        </div>
                      </td>
                      <td className={styles.dateCell}>
                        <div className={styles.dateInfo}>
                          <Calendar size={14} className={styles.cellIcon} />
                          <span>{new Date(lead.enquiry_date).toLocaleDateString('en-GB')}</span>
                        </div>
                      </td>
                      <td className={styles.enquiryTypeCell}>
                        <span className={styles.enquiryTag}>{lead.enquiry_type}</span>
                      </td>
                      <td className={styles.statusCell}>
                        <div className={styles.statusWrapper}>
                          <span className={`${styles.statusTag} ${styles[`status${lead.project_status?.replace(/\s+/g, '')}`]}`}>
                            {lead.project_status}
                          </span>
                          {["Completed"].includes(lead.project_status) && (
                            <span className={styles.convertedBadge}>
                              <CheckCircle size={12} />
                              Project
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.followupCell}>
                        <div className={styles.followupText}>
                          {lead.followup1_description || <span className={styles.noData}>No follow-up</span>}
                        </div>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEdit(lead)}
                            title="Edit lead details"
                            aria-label="Edit lead"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            className={styles.deleteButton} 
                            onClick={() => handleDelete(lead._id)}
                            title="Delete this lead"
                            aria-label="Delete lead"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className={`${styles.convertButton} ${["Regretted", "Completed"].includes(lead.project_status) ? styles.disabled : ''}`}
                            onClick={() => router.push(`/projects/add?leadId=${lead._id}`)}
                            title={["Regretted", "Completed"].includes(lead.project_status) ? "Cannot convert this lead" : "Convert to project"}
                            disabled={["Regretted", "Completed"].includes(lead.project_status)}
                          >
                            <ArrowRight size={16} />
                            <span>Convert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className={styles.emptyState}>
                      <div className={styles.emptyContent}>
                        <FileText size={48} className={styles.emptyIcon} />
                        <h3>No leads found</h3>
                        <p>Start by adding your first lead or try adjusting your search filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default LeadsTable;