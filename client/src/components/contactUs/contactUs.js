import React, { useState } from "react";
import "./contactUs.css";
import ContactCard from "./component/contactCard";
import { BiLogoGmail } from "react-icons/bi";
import { PiChatCenteredTextFill } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdEmojiPeople } from "react-icons/md";
import SocialMedia from "./component/socialMedia";
import Address from "./component/address";
import OurTeamSection from "./component/ourTeamSection";
import Animation from "../templates/animation";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../admin/AdminContext";
import AdminContactEditor from "../admin/AdminContactEditor";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/helper";

const ContactUs = () => {
  const { isAdmin } = useAdmin();
  const [email, setEmail] = useState("snehita@iitrpr.ac.in");
  const [showContactEditor, setShowContactEditor] = useState(false);
  const [showCounselorEditor, setShowCounselorEditor] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  React.useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/contact-details`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].email) {
            setEmail(data[0].email);
          }
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };
    fetchContactDetails();
  }, [reloadKey]);

  return (
    <div className="contactUs">
      <div className="contactUs-heading-section">
        <div className="container d-flex flex-column align-items-center">
          <div className="contactUs-heading-section-contactUs">CONTACT US</div>
          <div className="contactUs-heading-section-tagline">Get In Touch</div>
          <div className="px-5 contactUs-heading-section-caption text-wrap">
            Looking forward to hear from you
          </div>
        </div>
      </div>

      <div className="container d-flex flex-row row-cols-1 row-cols-sm-4 justify-content-center contactMode-section flex-wrap">
        <ContactCard
          icon={<BiLogoGmail />}
          contactMode={"Mail Us"}
          backgroundColor={"rgb(205,204,248)"}
          link={`mailto:${email}`}
        />
        <ContactCard
          icon={<MdEmojiPeople />}
          contactMode={"Meet Our Team"}
          backgroundColor={"rgb(248, 238, 204)"}
          link={"/TeamPage"}
        />
        <ContactCard
          icon={<RiPagesLine />}
          contactMode={"Appointment"}
          backgroundColor={"rgb(169,229,178)"}
          link={"/appointment"}
        />
      </div>

      <Animation />

      {/* Address section with admin edit button */}
      <div style={{ position: "relative" }}>
        <Address key={`addr-${reloadKey}`} />
        {isAdmin && (
          <div className="adm-inline-edit-wrap">
            <button
              className="adm-inline-edit-btn"
              onClick={() => setShowContactEditor(true)}
            >
              ✏️ Edit Address
            </button>
          </div>
        )}
      </div>

      {/* Team section with admin edit button */}
      <div style={{ position: "relative" }}>
        <OurTeamSection key={`team-${reloadKey}`} />
        {isAdmin && (
          <div className="adm-inline-edit-wrap" style={{ marginTop: "8px" }}>
            <button
              className="adm-inline-edit-btn"
              onClick={() => setShowCounselorEditor(true)}
            >
              ✏️ Edit Counselors
            </button>
          </div>
        )}
      </div>

      {/* Admin modals */}
      {showContactEditor && (
        <AdminContactEditor
          onClose={() => setShowContactEditor(false)}
          onSaved={() => setReloadKey((k) => k + 1)}
        />
      )}
      {showCounselorEditor && (
        <AdminCounselorEditor
          onClose={() => setShowCounselorEditor(false)}
          onSaved={() => setReloadKey((k) => k + 1)}
        />
      )}
    </div>
  );
};


const AdminCounselorEditor = ({ onClose, onSaved }) => {
  const [counselors, setCounselors] = React.useState([]);
  const [form, setForm] = React.useState({ name: "", email: "" });
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);

  const fetchCounselors = React.useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/counselors`, {
        withCredentials: true,
      });
      setCounselors(res.data);
    } catch {
      toast.error("Failed to load counselors");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchCounselors(); }, [fetchCounselors]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    setAdding(true);
    try {
      await axios.post(`${BASE_URL}/api/admin/counselor`, form, { withCredentials: true });
      toast.success("Counselor added!");
      setForm({ name: "", email: "" });
      fetchCounselors();
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add");
    } finally { setAdding(false); }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/counselor/${id}`, { withCredentials: true });
      toast.success("Removed");
      fetchCounselors();
      onSaved();
    } catch { toast.error("Failed to remove"); }
  };

  return (
    <div className="aum-overlay" onClick={onClose}>
      <div className="aum-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aum-modal-head">
          <h5 className="aum-modal-title">✏️ Manage Counselors</h5>
          <button className="aum-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="aum-modal-body">
          {loading && <p className="text-muted">Loading…</p>}
          {counselors.map((c) => (
            <div className="aum-entry" key={c.id}>
              <div className="aum-entry-content">
                <strong>{c.name}</strong>
                <p className="aum-entry-desc" style={{ margin: 0 }}>{c.email}</p>
              </div>
              <div className="aum-entry-actions">
                <button className="aum-ctrl-del" onClick={() => handleRemove(c.id, c.name)}>🗑️ Remove</button>
              </div>
            </div>
          ))}
          <hr />
          <h6 style={{ fontWeight: 700, color: "#464e5b" }}>Register New Counselor</h6>
          <form onSubmit={handleAdd}>
            <div className="aum-field">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Jane Doe" required />
            </div>
            <div className="aum-field" style={{ marginTop: "10px" }}>
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="counselor@iitrpr.ac.in" required />
            </div>
            <button type="submit" className="aum-btn aum-btn-primary" style={{ marginTop: "12px" }} disabled={adding}>
              {adding ? "Adding…" : "+ Add Counselor"}
            </button>
          </form>
        </div>
        <div className="aum-modal-foot">
          <button className="aum-btn aum-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ContactUs;
