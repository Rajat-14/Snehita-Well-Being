import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { toast, ToastContainer } from 'react-toastify';
import ImageCropperModal from '../common/ImageCropperModal';

const TABS = [
  { key: 'email',   label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'team',    label: 'Meet Our Team' },
  { key: 'buddies', label: 'Snehita Buddies' },
];

const ManageContactUs = () => {
  const [activeTab, setActiveTab] = useState('email');

  // Data State
  const [contactDetails, setContactDetails] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [contactRes, teamRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/contact-details`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin/team`, { withCredentials: true }),
      ]);

      if (contactRes.data.length > 0) {
        setContactDetails(contactRes.data[0]);
      }

      const allMembers = teamRes.data;
      setTeamMembers(allMembers.filter(m => ['dean', 'faculty_advisor', 'counsellor'].includes(m.type)));
      setBuddies(allMembers.filter(m => m.type === 'buddy'));
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#888' }}>Loading Contact Us data...</div>;

  const tabBarStyle = { display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '10px', flexWrap: 'wrap' };
  const tabBtnStyle = (active) => ({
    padding: '8px 18px', border: 'none', cursor: 'pointer', fontWeight: 500, borderRadius: '6px',
    background: active ? '#20b3f7' : '#f0f4f8', color: active ? '#fff' : '#444',
    transition: 'all 0.2s',
  });

  return (
    <div>
      <ToastContainer />
      <div className="admin-section-header">Manage Contact Us</div>

      <div style={tabBarStyle}>
        {TABS.map(t => (
          <button key={t.key} style={tabBtnStyle(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'email'   && <EmailManager   contactDetails={contactDetails} refresh={fetchData} />}
      {activeTab === 'address' && <AddressManager contactDetails={contactDetails} refresh={fetchData} />}
      {activeTab === 'team'    && <TeamManager    teamMembers={teamMembers}        refresh={fetchData} />}
      {activeTab === 'buddies' && <BuddiesManager buddies={buddies}               refresh={fetchData} />}
    </div>
  );
};

// ─── Email Manager ────────────────────────────────────────────────────────────
const EmailManager = ({ contactDetails, refresh }) => {
  const [email, setEmail] = useState(contactDetails?.email || '');

  useEffect(() => { setEmail(contactDetails?.email || ''); }, [contactDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...contactDetails, email };
      if (contactDetails?.id) {
        await axios.put(`${BASE_URL}/api/admin/contact-details/${contactDetails.id}`, payload, { withCredentials: true });
        toast.success('Email updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/api/admin/contact-details`, payload, { withCredentials: true });
        toast.success('Email saved!');
      }
      refresh();
    } catch {
      toast.error('Failed to save email.');
    }
  };

  return (
    <div className="admin-card">
      <h3>Edit Contact Email</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 15px 0' }}>
        This email appears on the "Mail Us" card on the Contact Us page.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="admin-form-group">
          <label>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="admin-input"
            placeholder="e.g. snehita@iitrpr.ac.in"
          />
        </div>
        <button type="submit" className="admin-btn">Save Email</button>
      </form>
      {contactDetails?.email && (
        <div style={{ marginTop: '15px', padding: '10px 15px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #b8e6fb' }}>
          <strong>Current Email:</strong> {contactDetails.email}
        </div>
      )}
    </div>
  );
};

// ─── Address Manager ──────────────────────────────────────────────────────────
const AddressManager = ({ contactDetails, refresh }) => {
  const [form, setForm] = useState({
    location: '', addressLine1: '', addressLine2: '', addressLine3: '',
    city: '', state: '', country: '', postalCode: '', mapsLink: '',
    email: '',
  });

  useEffect(() => {
    if (contactDetails) setForm({ ...form, ...contactDetails });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactDetails]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contactDetails?.id) {
        await axios.put(`${BASE_URL}/api/admin/contact-details/${contactDetails.id}`, form, { withCredentials: true });
        toast.success('Address updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/api/admin/contact-details`, form, { withCredentials: true });
        toast.success('Address saved!');
      }
      refresh();
    } catch {
      toast.error('Failed to save address.');
    }
  };

  const field = (label, name, placeholder = '', type = 'text') => (
    <div className="admin-form-group">
      <label>{label}</label>
      <input type={type} name={name} value={form[name] || ''} onChange={handleChange} className="admin-input" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="admin-card">
      <h3>Edit Snehita Wellbeing Cell Address</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {field('Location Name', 'location', 'e.g. Snehita Wellbeing Cell, IIT Ropar')}
        {field('Address Line 1', 'addressLine1', 'e.g. Building Name, Floor')}
        {field('Address Line 2', 'addressLine2')}
        {field('Address Line 3', 'addressLine3')}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>{field('City', 'city')}</div>
          <div style={{ flex: 1 }}>{field('State', 'state')}</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>{field('Country', 'country')}</div>
          <div style={{ flex: 1 }}>{field('Postal Code', 'postalCode')}</div>
        </div>
        {field('Google Maps Link', 'mapsLink', 'https://maps.google.com/...')}
        <button type="submit" className="admin-btn">Save Address</button>
      </form>
    </div>
  );
};

// ─── Shared Team Member Form + List ──────────────────────────────────────────
const MemberForm = ({ title, typeOptions, initialType, onSave, onCancel, existingData }) => {
const emptyForm = { name: '', designation: '', type: initialType, email: '', telephoneNo: '', message: '', image: '', experience: '' };
  const [formData, setFormData] = useState(existingData || emptyForm);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingData) {
      let msg = existingData.message || '';
      if (msg && msg.startsWith('[')) {
        try { const p = JSON.parse(msg); if (Array.isArray(p)) msg = p.join('\n'); } catch (e) {}
      }
      setFormData({ ...existingData, message: msg });
    }
  }, [existingData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => { setTempImageSrc(reader.result); setShowCropper(true); };
      reader.readAsDataURL(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedBase64) => {
    setShowCropper(false);
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const uploadData = new FormData();
      uploadData.append('image', file);
      const uploadRes = await axios.post(`${BASE_URL}/api/admin/upload`, uploadData, { withCredentials: true });
      setFormData(prev => ({ ...prev, image: uploadRes.data.imageUrl }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required.');
    const payload = { ...formData };
    if (payload.message && !payload.message.startsWith('[')) {
      payload.message = JSON.stringify(payload.message.split('\n').filter(l => l.trim()));
    }
    await onSave(payload);
  };

  const imgSrc = formData.image
    ? (formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `${BASE_URL}${formData.image}`)
    : null;

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Image */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {imgSrc && <img src={imgSrc} alt="Preview" className="profile-pic-preview" />}
          <div className="admin-form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="admin-input" />
            <small style={{ color: '#888' }}>Select image to open cropper (1:1 ratio ideal)</small>
          </div>
        </div>

        {/* Name + Type */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="admin-input" placeholder="e.g. Dr. Jane Doe" />
          </div>
          {typeOptions.length > 1 && (
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="admin-input">
                {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Designation */}
        <div className="admin-form-group">
          <label>Designation / Role</label>
          <select name="designation" value={formData.designation} onChange={handleChange} className="admin-input" required>
            <option value="">-- Select Designation --</option>
            <option value="Counsellor">Counsellor</option>
            <option value="Senior Counsellor">Senior Counsellor</option>
            <option value="Dean">Dean</option>
            <option value="Faculty Advisor">Faculty Advisor</option>
            <option value="Director">Director</option>
          </select>
        </div>

        {/* Email + Phone */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-input" placeholder="name@domain.com" />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Telephone</label>
            <input type="text" name="telephoneNo" value={formData.telephoneNo} onChange={handleChange} className="admin-input" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        {/* Experience */}
        <div className="admin-form-group">
          <label>Experience / Description (Displayed on Team / Contact pages)</label>
          <textarea name="experience" value={formData.experience} onChange={handleChange} className="admin-textarea" placeholder="Enter experience or short description." />
        </div>

        {/* Message */}
        <div className="admin-form-group">
          <label>Message / Long Description (Displayed on About Us page)</label>
          <textarea name="message" value={formData.message} onChange={handleChange} className="admin-textarea" placeholder="Enter descriptive message. New lines are respected." />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="admin-btn">{existingData ? 'Update' : 'Add'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="admin-btn" style={{ backgroundColor: '#95a5a6' }}>Cancel</button>
          )}
        </div>
      </form>

      {showCropper && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        />
      )}
    </>
  );
};

const MemberList = ({ members, onEdit, onDelete }) => (
  <div className="admin-list-container" style={{ marginTop: '20px' }}>
    {members.map((member, index) => (
      <div
        key={member.id}
        className="admin-listItem"
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', flexGrow: 1 }}>
          <img
            src={member.image ? (member.image.startsWith('http') ? member.image : `${BASE_URL}${member.image}`) : 'https://via.placeholder.com/80'}
            alt={member.name}
            className="profile-pic-preview"
            style={{ width: '70px', height: '70px', margin: 0 }}
          />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: '0 0 3px 0', color: '#333' }}>{index + 1}. {member.name}</h4>
            <p style={{ margin: '0 0 2px 0', fontSize: '0.85rem', color: '#666' }}>{member.designation}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>
              {member.type === 'faculty_advisor' ? 'Faculty Advisor'
                : member.type === 'counsellor' ? 'Counsellor'
                : member.type === 'buddy' ? 'Snehita Buddy'
                : member.type.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
        <div className="admin-listItem-actions">
          <button onClick={() => onEdit(member)} className="admin-btn" style={{ padding: '5px 12px', fontSize: '0.9rem' }}>Edit</button>
          <button onClick={() => onDelete(member.id)} className="admin-btn admin-btn-delete" style={{ padding: '5px 12px', fontSize: '0.9rem' }}>Delete</button>
        </div>
      </div>
    ))}
    {members.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No members added yet.</p>}
  </div>
);

// ─── Meet Our Team Manager (dean / faculty_advisor / counsellor) ──────────────
const TeamManager = ({ teamMembers, refresh }) => {
  const [editingMember, setEditingMember] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const typeOptions = [
    { value: 'dean',           label: 'Dean' },
    { value: 'faculty_advisor', label: 'Faculty Advisor' },
    { value: 'counsellor',     label: 'Counsellor / Buddy (Contact page)' },
  ];

  const handleSave = async (payload) => {
    try {
      if (editingMember) {
        await axios.put(`${BASE_URL}/api/admin/team/${editingMember.id}`, payload, { withCredentials: true });
        toast.success('Team member updated!');
      } else {
        await axios.post(`${BASE_URL}/api/admin/team`, payload, { withCredentials: true });
        toast.success('Team member added!');
      }
      setEditingMember(null);
      setIsAdding(false);
      refresh();
    } catch {
      toast.error('Failed to save team member.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/team/${id}?cascade=false`, { withCredentials: true });
      toast.success('Deleted.');
      refresh();
    } catch {
      toast.error('Delete failed.');
    }
  };

  const handleEdit = (member) => { setEditingMember(member); setIsAdding(false); };
  const handleCancelEdit = () => { setEditingMember(null); setIsAdding(false); };

  const showForm = isAdding || editingMember;

  return (
    <div>
      <div className="admin-card">
        <h3>{editingMember ? 'Edit Team Member' : isAdding ? 'Add New Team Member' : 'Meet Our Team'}</h3>
        {!showForm ? (
          <button className="admin-btn" onClick={() => { setIsAdding(true); setEditingMember(null); }} style={{ alignSelf: 'flex-start' }}>
            + Add New Member
          </button>
        ) : (
          <MemberForm
            title={editingMember ? 'Edit Member' : 'Add Member'}
            typeOptions={typeOptions}
            initialType="dean"
            existingData={editingMember || null}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
      </div>

      <MemberList
        members={teamMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

// ─── Snehita Buddies Manager (type: buddy) ────────────────────────────────────
const BuddiesManager = ({ buddies, refresh }) => {
  const [editingBuddy, setEditingBuddy] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const buddyTypeOptions = [{ value: 'buddy', label: 'Snehita Buddy' }];

  const handleSave = async (payload) => {
    payload.type = 'buddy'; // force type
    // For buddies, use 'course' as designation context if needed
    try {
      if (editingBuddy) {
        await axios.put(`${BASE_URL}/api/admin/team/${editingBuddy.id}`, payload, { withCredentials: true });
        toast.success('Buddy updated!');
      } else {
        await axios.post(`${BASE_URL}/api/admin/team`, payload, { withCredentials: true });
        toast.success('Buddy added!');
      }
      setEditingBuddy(null);
      setIsAdding(false);
      refresh();
    } catch {
      toast.error('Failed to save buddy.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Snehita Buddy?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/team/${id}`, { withCredentials: true });
      toast.success('Buddy deleted.');
      refresh();
    } catch {
      toast.error('Delete failed.');
    }
  };

  const handleEdit = (buddy) => { setEditingBuddy(buddy); setIsAdding(false); };
  const handleCancelEdit = () => { setEditingBuddy(null); setIsAdding(false); };

  const showForm = isAdding || editingBuddy;

  return (
    <div>
      <div className="admin-card">
        <h3>{editingBuddy ? 'Edit Snehita Buddy' : isAdding ? 'Add New Snehita Buddy' : 'Snehita Buddies'}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
          Snehita Buddies appear on the Team Page. You can add, edit, or remove them here.
        </p>
        {!showForm ? (
          <button className="admin-btn" onClick={() => { setIsAdding(true); setEditingBuddy(null); }} style={{ alignSelf: 'flex-start' }}>
            + Add New Buddy
          </button>
        ) : (
          <BuddyForm
            existingData={editingBuddy || null}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
      </div>

      <MemberList
        members={buddies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

// ─── Buddy-specific Form (with course/branch field) ───────────────────────────
const BuddyForm = ({ existingData, onSave, onCancel }) => {
  const emptyForm = { name: '', designation: '', course: '', type: 'buddy', email: '', telephoneNo: '', instaId: '', linkedinId: '', image: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingData) setFormData({ ...emptyForm, ...existingData });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => { setTempImageSrc(reader.result); setShowCropper(true); };
      reader.readAsDataURL(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedBase64) => {
    setShowCropper(false);
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const uploadData = new FormData();
      uploadData.append('image', file);
      const uploadRes = await axios.post(`${BASE_URL}/api/admin/upload`, uploadData, { withCredentials: true });
      setFormData(prev => ({ ...prev, image: uploadRes.data.imageUrl }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required.');
    await onSave({ ...formData, type: 'buddy' });
  };

  const imgSrc = formData.image
    ? (formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `${BASE_URL}${formData.image}`)
    : null;

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Image */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {imgSrc && <img src={imgSrc} alt="Preview" className="profile-pic-preview" />}
          <div className="admin-form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="admin-input" />
            <small style={{ color: '#888' }}>Select image to open cropper (1:1 ratio ideal)</small>
          </div>
        </div>

        {/* Name + Course/Branch */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="admin-input" placeholder="e.g. Priya Sharma" />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Course / Branch</label>
            <input type="text" name="course" value={formData.course} onChange={handleChange} className="admin-input" placeholder="e.g. B.Tech CSE 4th Year" />
          </div>
        </div>

        {/* Designation */}
        <div className="admin-form-group">
          <label>Designation (optional)</label>
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="admin-input" placeholder="e.g. Snehita Buddy" />
        </div>

        {/* Email + Phone */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-input" placeholder="priya@iitrpr.ac.in" />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Telephone</label>
            <input type="text" name="telephoneNo" value={formData.telephoneNo} onChange={handleChange} className="admin-input" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        {/* Social Media */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Instagram ID</label>
            <input type="text" name="instaId" value={formData.instaId} onChange={handleChange} className="admin-input" placeholder="instagram username" />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>LinkedIn ID / URL</label>
            <input type="text" name="linkedinId" value={formData.linkedinId} onChange={handleChange} className="admin-input" placeholder="linkedin URL or username" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="admin-btn">{existingData ? 'Update Buddy' : 'Add Buddy'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="admin-btn" style={{ backgroundColor: '#95a5a6' }}>Cancel</button>
          )}
        </div>
      </form>

      {showCropper && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        />
      )}
    </>
  );
};

export default ManageContactUs;
