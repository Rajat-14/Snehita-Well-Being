import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../services/helper';
import './admin.css';

const API = (path) => `${BASE_URL}/api${path}`;

// ─── Edit Modal (About Us) ────────────────────────────────────────────────────
const EditEntryModal = ({ item, types, onSave, onClose }) => {
  const [draft, setDraft] = useState({ ...item });
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h5 className="adm-modal-title">Edit Entry</h5>
          <button className="adm-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          {types && (
            <div className="adm-field">
              <label>Type</label>
              <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}>
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          )}
          <div className="adm-field">
            <label>Title</label>
            <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Description / Message</label>
            <textarea rows={7} value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>
        <div className="adm-modal-foot">
          <button className="adm-btn adm-btn-outline" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={() => onSave(draft)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Add Entry Modal (About Us) ────────────────────────────────────────────────
const AddEntryModal = ({ types, onSave, onClose }) => {
  const [draft, setDraft] = useState({ title: '', description: '', type: types ? types[0].value : '' });
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h5 className="adm-modal-title">Add New Entry</h5>
          <button className="adm-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          {types && (
            <div className="adm-field">
              <label>Type</label>
              <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}>
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          )}
          <div className="adm-field">
            <label>Title</label>
            <input type="text" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Enter title..." />
          </div>
          <div className="adm-field">
            <label>Description / Message</label>
            <textarea rows={7} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Enter content..." />
          </div>
        </div>
        <div className="adm-modal-foot">
          <button className="adm-btn adm-btn-outline" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={() => onSave(draft)}>Add Entry</button>
        </div>
      </div>
    </div>
  );
};

// ─── Contact Modal ────────────────────────────────────────────────────────────
const ContactModal = ({ contact, isNew, onSave, onClose }) => {
  const empty = { location: '', addressLine1: '', addressLine2: '', addressLine3: '', city: '', state: '', country: 'India', postalCode: '', email: '', mapsLink: '' };
  const [draft, setDraft] = useState(contact ? { ...contact } : empty);
  const fields = [
    { key: 'location', label: 'Location Name', placeholder: 'e.g. IIT Ropar Campus' },
    { key: 'addressLine1', label: 'Address Line 1', placeholder: 'Street / Building' },
    { key: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: '' },
    { key: 'addressLine3', label: 'Address Line 3 (optional)', placeholder: '' },
    { key: 'city', label: 'City', placeholder: 'City' },
    { key: 'state', label: 'State', placeholder: 'State' },
    { key: 'country', label: 'Country', placeholder: 'Country' },
    { key: 'postalCode', label: 'Postal Code', placeholder: '140001' },
    { key: 'email', label: 'Contact Email', placeholder: 'contact@example.com' },
    { key: 'mapsLink', label: 'Google Maps Link', placeholder: 'https://maps.google.com/...' },
  ];
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h5 className="adm-modal-title">{isNew ? 'Add Contact Location' : 'Edit Contact Location'}</h5>
          <button className="adm-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body adm-modal-grid">
          {fields.map(({ key, label, placeholder }) => (
            <div className="adm-field" key={key}>
              <label>{label}</label>
              <input type="text" value={draft[key] || ''} placeholder={placeholder}
                onChange={e => setDraft({ ...draft, [key]: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="adm-modal-foot">
          <button className="adm-btn adm-btn-outline" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={() => onSave(draft)}>
            {isNew ? 'Add Location' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <div className="adm-overlay" onClick={onClose}>
    <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()}>
      <div className="adm-modal-head">
        <h5 className="adm-modal-title">Confirm Delete</h5>
        <button className="adm-modal-x" onClick={onClose}>✕</button>
      </div>
      <div className="adm-modal-body">
        <p style={{ margin: 0, color: '#464e5b', fontSize: '0.95rem' }}>{message}</p>
      </div>
      <div className="adm-modal-foot">
        <button className="adm-btn adm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="adm-btn adm-btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

// ─── About Us Tab ─────────────────────────────────────────────────────────────
const AboutUsTab = ({ editMode }) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  const handleSave = async (draft) => {
    try {
      await axios.put(API(`/admin/organization-info/${draft.id}`), draft, { withCredentials: true });
      toast.success('Updated successfully!');
      setEditingItem(null);
      fetchItems();
    } catch { toast.error('Failed to update'); }
  };

  const handleAdd = async (draft) => {
    if (!draft.title || !draft.description) { toast.error('Title and description are required'); return; }
    try {
      await axios.post(API('/admin/organization-info'), draft, { withCredentials: true });
      toast.success('Entry added!');
      setAddingNew(false);
      fetchItems();
    } catch { toast.error('Failed to create entry'); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(API(`/admin/organization-info/${confirmDelete.id}`), { withCredentials: true });
      toast.success('Deleted');
      setConfirmDelete(null);
      fetchItems();
    } catch { toast.error('Failed to delete'); }
  };

  const typeLabel = (val) => types.find(t => t.value === val)?.label || val;

  return (
    <div className="adm-tab-pane">
      {/* Page heading matching site style */}
      <div className="adm-page-heading">
        <p className="adm-page-head">ABOUT US</p>
      </div>

      {editMode && (
        <div className="adm-edit-bar">
          <span className="adm-edit-label">✏️ Edit Mode Active</span>
          <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => setAddingNew(true)}>
            + Add Entry
          </button>
        </div>
      )}

      <div className="container">
        {items.length === 0 && <p className="adm-empty">No entries found.</p>}
        {items.map(item => (
          <div className="adm-content-card" key={item.id}>
            {editMode && (
              <div className="adm-card-controls">
                <button className="adm-ctrl-edit" onClick={() => setEditingItem(item)}>✏️ Edit</button>
                <button className="adm-ctrl-del" onClick={() => setConfirmDelete(item)}>🗑️ Delete</button>
              </div>
            )}
            <span className="adm-type-pill">{typeLabel(item.type)}</span>
            <h5 className="adm-entry-title">{item.title}</h5>
            <p className="adm-entry-text">{item.description}</p>
          </div>
        ))}
      </div>

      {editingItem && <EditEntryModal item={editingItem} types={types} onSave={handleSave} onClose={() => setEditingItem(null)} />}
      {addingNew && <AddEntryModal types={types} onSave={handleAdd} onClose={() => setAddingNew(false)} />}
      {confirmDelete && (
        <ConfirmModal
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

// ─── Contact Us Tab ───────────────────────────────────────────────────────────
const ContactUsTab = ({ editMode }) => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(API('/admin/contact-details'), { withCredentials: true });
      setContacts(res.data);
    } catch { toast.error('Failed to load contact details'); }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleSave = async (draft) => {
    try {
      await axios.put(API(`/admin/contact-detail/${draft.id}`), draft, { withCredentials: true });
      toast.success('Contact updated!');
      setEditingContact(null);
      fetchContacts();
    } catch { toast.error('Failed to update contact'); }
  };

  const handleAdd = async (draft) => {
    if (!draft.location || !draft.addressLine1 || !draft.city) {
      toast.error('Location, Address Line 1 and City are required'); return;
    }
    try {
      await axios.post(API('/admin/contact-detail'), draft, { withCredentials: true });
      toast.success('Contact added!');
      setAddingNew(false);
      fetchContacts();
    } catch { toast.error('Failed to create contact'); }
  };

  return (
    <div className="adm-tab-pane">
      {/* Matching contactUs.css heading style */}
      <div className="adm-contact-hero">
        <div className="container d-flex flex-column align-items-center">
          <div className="adm-contact-heading">CONTACT US</div>
          <div className="adm-contact-sub">Address Details</div>
        </div>
      </div>

      <div className="container adm-contact-cards-wrap">
        {editMode && (
          <div className="adm-edit-bar">
            <span className="adm-edit-label">✏️ Edit Mode Active</span>
            <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => setAddingNew(true)}>
              + Add Location
            </button>
          </div>
        )}

        {contacts.length === 0 && <p className="adm-empty">No contact details found.</p>}
        {contacts.map(c => (
          <div className="adm-content-card adm-contact-entry" key={c.id}>
            {editMode && (
              <div className="adm-card-controls">
                <button className="adm-ctrl-edit" onClick={() => setEditingContact(c)}>✏️ Edit</button>
              </div>
            )}
            <span className="adm-type-pill">📍 {c.location}</span>
            <p className="adm-entry-text" style={{ marginTop: '10px' }}>
              {[c.addressLine1, c.addressLine2, c.addressLine3].filter(Boolean).join(', ')}<br />
              {c.city}{c.state ? `, ${c.state}` : ''}{c.postalCode ? ` — ${c.postalCode}` : ''}<br />
              {c.country}
              {c.email && <><br /><strong>Email:</strong> {c.email}</>}
            </p>
            {c.mapsLink && (
              <a href={c.mapsLink} target="_blank" rel="noopener noreferrer" className="adm-map-btn">
                📌 View on Maps
              </a>
            )}
          </div>
        ))}
      </div>

      {editingContact && <ContactModal contact={editingContact} isNew={false} onSave={handleSave} onClose={() => setEditingContact(null)} />}
      {addingNew && <ContactModal isNew={true} onSave={handleAdd} onClose={() => setAddingNew(false)} />}
    </div>
  );
};

// ─── Counselors Tab ───────────────────────────────────────────────────────────
const CounselorsTab = ({ editMode }) => {
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const fetchCounselors = useCallback(async () => {
    try {
      const res = await axios.get(API('/admin/counselors'), { withCredentials: true });
      setCounselors(res.data);
    } catch { toast.error('Failed to load counselors'); }
  }, []);

  useEffect(() => { fetchCounselors(); }, [fetchCounselors]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setIsAdding(true);
    try {
      await axios.post(API('/admin/counselor'), form, { withCredentials: true });
      toast.success(`Counselor "${form.name}" added!`);
      setForm({ name: '', email: '' });
      fetchCounselors();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add counselor');
    } finally { setIsAdding(false); }
  };

  const handleRemove = async () => {
    if (!confirmRemove) return;
    try {
      await axios.delete(API(`/admin/counselor/${confirmRemove.id}`), { withCredentials: true });
      toast.success('Counselor removed');
      setConfirmRemove(null);
      fetchCounselors();
    } catch { toast.error('Failed to remove counselor'); }
  };

  return (
    <div className="adm-tab-pane">
      <div className="adm-page-heading">
        <p className="adm-page-head">TEAM / COUNSELORS</p>
      </div>

      {editMode && (
        <div className="container">
          <div className="adm-edit-bar">
            <span className="adm-edit-label">✏️ Edit Mode Active</span>
          </div>
        </div>
      )}

      {/* Counselor cards grid */}
      <div className="container">
        <div className="adm-counselors-grid">
          {counselors.length === 0 && <p className="adm-empty">No counselors registered yet.</p>}
          {counselors.map(c => (
            <div className="adm-counselor-card" key={c.id}>
              <div className="adm-avatar">{c.name?.charAt(0)?.toUpperCase() || 'C'}</div>
              <strong className="adm-c-name">{c.name}</strong>
              <span className="adm-c-email">{c.email}</span>
              <span className="adm-role-tag">Counsellor</span>
              {editMode && (
                <button className="adm-ctrl-del adm-del-card" onClick={() => setConfirmRemove(c)}>
                  🗑️ Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Register form — edit mode only */}
        {editMode && (
          <div className="adm-add-section">
            <h6 className="adm-add-section-title">Register New Counselor</h6>
            <p className="adm-hint">
              The counselor will be registered with the <strong>counselor</strong> role and can log in via the OTP system.
            </p>
            <form onSubmit={handleAdd} className="adm-c-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label htmlFor="c-name">Full Name</label>
                  <input id="c-name" type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Jane Doe" required />
                </div>
                <div className="adm-field">
                  <label htmlFor="c-email">Email Address</label>
                  <input id="c-email" type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="counselor@iitrpr.ac.in" required />
                </div>
              </div>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={isAdding}>
                {isAdding ? <span className="adm-spinner" /> : '+ Register Counselor'}
              </button>
            </form>
          </div>
        )}
      </div>

      {confirmRemove && (
        <ConfirmModal
          message={`Remove "${confirmRemove.name}"? They will lose system access.`}
          onConfirm={handleRemove}
          onClose={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/verify`, { withCredentials: true })
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await axios.get(`${BASE_URL}/api/admin/logout`, { withCredentials: true });
    navigate('/admin/login');
  };

  return (
    <div className="adm-wrapper">
      {/* Admin control strip — matches Bootstrap navbar bg */}
      <div className="adm-strip">
        <div className="adm-strip-left">
          <span className="adm-badge-admin">🛡️ ADMIN</span>
          <div className="adm-tabs">
            {[
              { id: 'about',      label: 'About Us' },
              { id: 'contact',    label: 'Contact Us' },
              { id: 'counselors', label: 'Counselors' },
            ].map(t => (
              <button
                key={t.id}
                className={`adm-tab ${activeTab === t.id ? 'adm-tab--active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="adm-strip-right">
          <button
            className={`adm-edit-toggle ${editMode ? 'adm-edit-toggle--on' : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '🔒 Exit Editing' : '✏️ Enable Editing'}
          </button>
          <button className="adm-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'about'      && <AboutUsTab    editMode={editMode} />}
      {activeTab === 'contact'    && <ContactUsTab  editMode={editMode} />}
      {activeTab === 'counselors' && <CounselorsTab editMode={editMode} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;
