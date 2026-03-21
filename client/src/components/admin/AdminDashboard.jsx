import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../services/helper';
import './admin.css';

// ── Helpers ────────────────────────────────────────────────────────────────────
const API = (path) => `${BASE_URL}/api${path}`;

// ── Sub-components ─────────────────────────────────────────────────────────────

/** ─── About Us Tab ─────────────────── */
const AboutUsTab = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // { id, title, description, type }
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'aboutSnehita' });
  const [showAdd, setShowAdd] = useState(false);

  const types = [
    { value: 'aboutSnehita', label: 'About Snehita' },
    { value: 'directorMessage', label: "Director's Message" },
    { value: 'deanMessage', label: "Dean's Message" },
    { value: 'facultyAdvisorMessage', label: "Faculty Advisor's Message" },
    { value: 'counselorMessage', label: "Counsellor's Message" },
  ];

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(API('/admin/organization-info'), { withCredentials: true });
      setItems(res.data);
    } catch {
      toast.error('Failed to load organization info');
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await axios.put(API(`/admin/organization-info/${editing.id}`), editing, { withCredentials: true });
      toast.success('Updated successfully!');
      setEditing(null);
      fetchItems();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(API(`/admin/organization-info/${id}`), { withCredentials: true });
      toast.success('Deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleCreate = async () => {
    if (!newItem.title || !newItem.description) {
      toast.error('Title and description are required');
      return;
    }
    try {
      await axios.post(API('/admin/organization-info'), newItem, { withCredentials: true });
      toast.success('Entry added!');
      setNewItem({ title: '', description: '', type: 'aboutSnehita' });
      setShowAdd(false);
      fetchItems();
    } catch {
      toast.error('Failed to create entry');
    }
  };

  const typeLabel = (val) => types.find(t => t.value === val)?.label || val;

  return (
    <div className="admin-tab-content">
      <div className="admin-section-header">
        <h2>About Us — Organization Info</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showAdd && (
        <div className="admin-card admin-card-add">
          <h3>Add New Entry</h3>
          <div className="admin-field">
            <label>Type</label>
            <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })}>
              {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Title</label>
            <input type="text" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} placeholder="Title" />
          </div>
          <div className="admin-field">
            <label>Description</label>
            <textarea rows={5} value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} placeholder="Description / Message..." />
          </div>
          <div className="admin-btn-row">
            <button className="admin-btn admin-btn-primary" onClick={handleCreate}>Save Entry</button>
          </div>
        </div>
      )}

      {items.length === 0 && <p className="admin-empty">No entries found.</p>}

      <div className="admin-list">
        {items.map(item => (
          <div className="admin-card" key={item.id}>
            {editing?.id === item.id ? (
              <>
                <div className="admin-field">
                  <label>Type</label>
                  <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                    {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea rows={6} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="admin-btn-row">
                  <button className="admin-btn admin-btn-primary" onClick={handleUpdate}>Save</button>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span className="admin-badge">{typeLabel(item.type)}</span>
                <h3 className="admin-card-title">{item.title}</h3>
                <p className="admin-card-desc">{item.description}</p>
                <div className="admin-btn-row">
                  <button className="admin-btn admin-btn-secondary" onClick={() => setEditing({ ...item })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/** ─── Contact Us Tab ─────────────────── */
const ContactUsTab = () => {
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const emptyContact = {
    location: '', addressLine1: '', addressLine2: '', addressLine3: '',
    city: '', state: '', country: 'India', postalCode: '', email: '', mapsLink: ''
  };
  const [newContact, setNewContact] = useState(emptyContact);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(API('/admin/contact-details'), { withCredentials: true });
      setContacts(res.data);
    } catch {
      toast.error('Failed to load contact details');
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleUpdate = async () => {
    try {
      await axios.put(API(`/admin/contact-detail/${editing.id}`), editing, { withCredentials: true });
      toast.success('Contact updated!');
      setEditing(null);
      fetchContacts();
    } catch {
      toast.error('Failed to update contact');
    }
  };

  const handleCreate = async () => {
    if (!newContact.location || !newContact.addressLine1 || !newContact.city) {
      toast.error('Location, Address Line 1 and City are required');
      return;
    }
    try {
      await axios.post(API('/admin/contact-detail'), newContact, { withCredentials: true });
      toast.success('Contact added!');
      setNewContact(emptyContact);
      setShowAdd(false);
      fetchContacts();
    } catch {
      toast.error('Failed to create contact');
    }
  };

  const ContactForm = ({ data, setData, onSubmit, onCancel, submitLabel }) => (
    <div className="admin-contact-form">
      <div className="admin-field-grid">
        {[
          { key: 'location', label: 'Location Name', placeholder: 'e.g. IIT Ropar Campus' },
          { key: 'addressLine1', label: 'Address Line 1', placeholder: 'Street / Building' },
          { key: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: '' },
          { key: 'addressLine3', label: 'Address Line 3 (optional)', placeholder: '' },
          { key: 'city', label: 'City', placeholder: 'City' },
          { key: 'state', label: 'State', placeholder: 'State' },
          { key: 'country', label: 'Country', placeholder: 'Country' },
          { key: 'postalCode', label: 'Postal Code', placeholder: '140001' },
          { key: 'email', label: 'Contact Email', placeholder: 'contact@example.com' },
        ].map(({ key, label, placeholder }) => (
          <div className="admin-field" key={key}>
            <label>{label}</label>
            <input type="text" value={data[key] || ''} placeholder={placeholder}
              onChange={e => setData({ ...data, [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="admin-field">
        <label>Google Maps Link</label>
        <input type="text" value={data.mapsLink || ''} placeholder="https://maps.google.com/..."
          onChange={e => setData({ ...data, mapsLink: e.target.value })} />
      </div>
      <div className="admin-btn-row">
        <button className="admin-btn admin-btn-primary" onClick={onSubmit}>{submitLabel}</button>
        <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="admin-tab-content">
      <div className="admin-section-header">
        <h2>Contact Us — Address Details</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Location'}
        </button>
      </div>

      {showAdd && (
        <div className="admin-card admin-card-add">
          <h3>Add New Contact Location</h3>
          <ContactForm data={newContact} setData={setNewContact} onSubmit={handleCreate} onCancel={() => setShowAdd(false)} submitLabel="Add Location" />
        </div>
      )}

      {contacts.length === 0 && <p className="admin-empty">No contact details found.</p>}

      {contacts.map(c => (
        <div className="admin-card" key={c.id}>
          {editing?.id === c.id ? (
            <>
              <h3>Edit Contact</h3>
              <ContactForm data={editing} setData={setEditing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} submitLabel="Save Changes" />
            </>
          ) : (
            <>
              <div className="admin-contact-view">
                <div>
                  <span className="admin-badge">Contact Location</span>
                  <h3 className="admin-card-title">{c.location}</h3>
                  <p className="admin-card-desc">
                    {[c.addressLine1, c.addressLine2, c.addressLine3].filter(Boolean).join(', ')}<br />
                    {c.city}, {c.state} — {c.postalCode}<br />
                    {c.country}<br />
                    {c.email && <><strong>Email:</strong> {c.email}</>}
                  </p>
                </div>
              </div>
              <div className="admin-btn-row">
                <button className="admin-btn admin-btn-secondary" onClick={() => setEditing({ ...c })}>Edit</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

/** ─── Counselors Tab ────────────────── */
const CounselorsTab = () => {
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);

  const fetchCounselors = useCallback(async () => {
    try {
      const res = await axios.get(API('/admin/counselors'), { withCredentials: true });
      setCounselors(res.data);
    } catch {
      toast.error('Failed to load counselors');
    }
  }, []);

  useEffect(() => { fetchCounselors(); }, [fetchCounselors]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    setIsAdding(true);
    try {
      await axios.post(API('/admin/counselor'), form, { withCredentials: true });
      toast.success(`Counselor "${form.name}" added successfully!`);
      setForm({ name: '', email: '' });
      fetchCounselors();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add counselor');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove counselor "${name}"?`)) return;
    try {
      await axios.delete(API(`/admin/counselor/${id}`), { withCredentials: true });
      toast.success('Counselor removed');
      fetchCounselors();
    } catch {
      toast.error('Failed to remove counselor');
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-section-header">
        <h2>Manage Counselors</h2>
      </div>

      {/* Add Counselor Card */}
      <div className="admin-card admin-card-add">
        <h3>Add New Counselor</h3>
        <p className="admin-hint">
          The counselor will be registered in the system with the <strong>counselor</strong> role.
          They can then log in using the OTP system.
        </p>
        <form onSubmit={handleAdd} className="admin-counselor-form">
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="counselor-name">Full Name</label>
              <input
                id="counselor-name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Jane Doe"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="counselor-email">Email Address</label>
              <input
                id="counselor-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="counselor@iitrpr.ac.in"
                required
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isAdding}>
            {isAdding ? <span className="admin-spinner-sm" /> : '+ Add Counselor'}
          </button>
        </form>
      </div>

      {/* List */}
      <h3 className="admin-subheading">Registered Counselors ({counselors.length})</h3>
      {counselors.length === 0 && <p className="admin-empty">No counselors added yet.</p>}
      <div className="admin-counselor-list">
        {counselors.map((c) => (
          <div className="admin-counselor-item" key={c.id}>
            <div className="admin-counselor-avatar">
              {c.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="admin-counselor-info">
              <strong>{c.name}</strong>
              <span>{c.email}</span>
            </div>
            <button
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => handleRemove(c.id, c.name)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Dashboard ──────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/verify`, { withCredentials: true })
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await axios.get(`${BASE_URL}/api/admin/logout`, { withCredentials: true });
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'about', label: '📝 About Us' },
    { id: 'contact', label: '📍 Contact Us' },
    { id: 'counselors', label: '👤 Counselors' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">S</div>
          <div>
            <div className="admin-sidebar-title">Snehita</div>
            <div className="admin-sidebar-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <span className="admin-topbar-user">Logged in as Admin</span>
        </header>

        <div className="admin-content">
          {activeTab === 'about'     && <AboutUsTab />}
          {activeTab === 'contact'   && <ContactUsTab />}
          {activeTab === 'counselors' && <CounselorsTab />}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;
