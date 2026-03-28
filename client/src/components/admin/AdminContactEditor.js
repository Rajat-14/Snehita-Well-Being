import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from '../services/helper';

const EMPTY = {
  location: '', addressLine1: '', addressLine2: '', addressLine3: '',
  city: '', state: '', country: 'India', postalCode: '', email: '', mapsLink: ''
};

const FIELDS = [
  { key: 'location',     label: 'Location Name',           placeholder: 'e.g. IIT Ropar Campus' },
  { key: 'addressLine1', label: 'Address Line 1',           placeholder: 'Street / Building' },
  { key: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: '' },
  { key: 'addressLine3', label: 'Address Line 3 (optional)', placeholder: '' },
  { key: 'city',         label: 'City',                    placeholder: 'City' },
  { key: 'state',        label: 'State',                   placeholder: 'State' },
  { key: 'country',      label: 'Country',                 placeholder: 'Country' },
  { key: 'postalCode',   label: 'Postal Code',             placeholder: '140001' },
  { key: 'email',        label: 'Contact Email',           placeholder: 'contact@example.com' },
  { key: 'mapsLink',     label: 'Google Maps Link',        placeholder: 'https://maps.google.com/...' },
];

const AdminContactEditor = ({ onClose, onSaved }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState(EMPTY);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/contact-details`, { withCredentials: true });
      setContacts(res.data);
    } catch { toast.error('Failed to load contacts'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const startEdit = (c) => { setEditingId(c.id); setDraft({ ...c }); setAddingNew(false); };
  const cancelEdit = () => { setEditingId(null); setDraft(EMPTY); };

  const saveEdit = async () => {
    try {
      await axios.put(`${BASE_URL}/api/admin/contact-detail/${editingId}`, draft, { withCredentials: true });
      toast.success('Contact updated!');
      cancelEdit(); fetchContacts(); onSaved();
    } catch { toast.error('Save failed'); }
  };

  const saveNew = async () => {
    if (!newDraft.location || !newDraft.addressLine1 || !newDraft.city) {
      toast.error('Location, Address Line 1 and City are required'); return;
    }
    try {
      await axios.post(`${BASE_URL}/api/admin/contact-detail`, newDraft, { withCredentials: true });
      toast.success('Contact added!');
      setAddingNew(false); setNewDraft(EMPTY); fetchContacts(); onSaved();
    } catch { toast.error('Could not add contact'); }
  };

  const renderForm = (data, setData, onSubmit, onCancel, submitLabel) => (
    <div className="aum-edit-block">
      <div className="aum-field-grid">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div className="aum-field" key={key}>
            <label>{label}</label>
            <input type="text" value={data[key] || ''} placeholder={placeholder}
              onChange={e => setData({ ...data, [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="aum-btn-row" style={{ marginTop: '12px' }}>
        <button className="aum-btn aum-btn-primary" onClick={onSubmit}>{submitLabel}</button>
        <button className="aum-btn aum-btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="aum-overlay" onClick={onClose}>
      <div className="aum-modal aum-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="aum-modal-head">
          <h5 className="aum-modal-title">✏️ Edit Contact Details</h5>
          <button className="aum-modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="aum-modal-body">
          {loading && <p className="text-muted">Loading…</p>}
          {contacts.map(c =>
            editingId === c.id ? (
              <div key={c.id}>
                <strong style={{ color: '#464e5b' }}>Editing: {c.location}</strong>
                {renderForm(draft, setDraft, saveEdit, cancelEdit, 'Save Changes')}
              </div>
            ) : (
              <div className="aum-entry" key={c.id}>
                <div className="aum-entry-content">
                  <strong>{c.location}</strong>
                  <p className="aum-entry-desc" style={{ margin: 0 }}>
                    {c.addressLine1}, {c.city}, {c.country}
                  </p>
                </div>
                <div className="aum-entry-actions">
                  <button className="aum-ctrl-edit" onClick={() => startEdit(c)}>✏️ Edit</button>
                </div>
              </div>
            )
          )}

          {addingNew && (
            <div>
              <strong style={{ color: '#464e5b' }}>New Location</strong>
              {renderForm(newDraft, setNewDraft, saveNew, () => setAddingNew(false), 'Add Location')}
            </div>
          )}
        </div>

        <div className="aum-modal-foot">
          <button className="aum-btn aum-btn-outline"
            onClick={() => { setAddingNew(true); setEditingId(null); }}>
            + Add Location
          </button>
          <button className="aum-btn aum-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminContactEditor;
