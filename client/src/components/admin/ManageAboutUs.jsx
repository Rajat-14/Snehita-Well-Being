import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { toast, ToastContainer } from 'react-toastify';
import ImageCropperModal from '../common/ImageCropperModal';

const ManageAboutUs = () => {
  const [activeSubTab, setActiveSubTab] = useState('snehita');
  
  // Data State
  const [orgInfo, setOrgInfo] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [orgRes, teamRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/org-info`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin/team`, { withCredentials: true })
      ]);
      setOrgInfo(orgRes.data);
      setTeam(teamRes.data);
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  if (loading) return <div>Loading Admin Data...</div>;

  return (
    <div>
      <ToastContainer />
      <div className="admin-section-header">Manage About Us</div>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        {['snehita', 'director', 'dean', 'faculty'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '8px 16px', border: 'none', background: activeSubTab === tab ? '#20b3f7' : '#eee',
              color: activeSubTab === tab ? 'white' : '#333', borderRadius: '4px', cursor: 'pointer', fontWeight: 500
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeSubTab === 'snehita' && <SnehitaManager orgInfo={orgInfo} refresh={fetchData} />}
      {activeSubTab === 'director' && <TeamRoleManager role="director" data={team.find(t => t.type === 'director')} refresh={fetchData} />}
      {activeSubTab === 'dean' && <TeamRoleManager role="dean" data={team.find(t => t.type === 'dean')} refresh={fetchData} />}
      {activeSubTab === 'faculty' && <FacultyManager team={team.filter(t => t.type === 'faculty_advisor')} refresh={fetchData} />}
      
    </div>
  );
};

// --- Sub Components ---

const SnehitaManager = ({ orgInfo, refresh }) => {
  const [form, setForm] = useState({ title: '', description: '', type: 'aboutSnehita' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/admin/org-info/${editingId}`, form, { withCredentials: true });
        toast.success("Entry updated!");
      } else {
        await axios.post(`${BASE_URL}/api/admin/org-info`, form, { withCredentials: true });
        toast.success("Entry added!");
      }
      setForm({ title: '', description: '', type: 'aboutSnehita' });
      setEditingId(null);
      refresh();
    } catch (err) {
      toast.error("Error saving entry");
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description, type: item.type });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/org-info/${id}`, { withCredentials: true });
      toast.success("Deleted");
      refresh();
    } catch(err) {
      toast.error("Delete failed");
    }
  };

  const handleDrop = async (e, destIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);
    if (sourceIndex === destIndex) return;
    
    let items = orgInfo.filter(info => info.type === 'aboutSnehita');
    const [draggedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, draggedItem);
    
    const payload = items.map((item, index) => ({ id: item.id, order: index }));
    try {
      await axios.post(`${BASE_URL}/api/admin/org-info/reorder`, { items: payload }, { withCredentials: true });
      refresh(false);
      toast.success("Reordered successfully");
    } catch (err) { toast.error("Reorder failed"); }
  };

  const handleMove = async (index, direction) => {
    let items = orgInfo.filter(info => info.type === 'aboutSnehita');
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    const payload = items.map((item, idx) => ({ id: item.id, order: idx }));
    try {
      await axios.post(`${BASE_URL}/api/admin/org-info/reorder`, { items: payload }, { withCredentials: true });
      refresh(false);
    } catch (err) { toast.error("Move failed"); }
  };

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? "Edit Snehita Entry" : "Add Snehita Entry"}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="admin-form-group">
            <label>Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label>Description</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="admin-textarea" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">Save</button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({title:'',description:'',type:'aboutSnehita'})}} className="admin-btn" style={{backgroundColor: '#95a5a6'}}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {orgInfo.filter(info => info.type === 'aboutSnehita').map((info, index) => (
          <div 
            key={info.id} 
            className="admin-card" 
            style={{ marginBottom: 0, cursor: 'grab' }}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('sourceIndex', index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
          >
            <h4 style={{ margin: '0 0 5px 0' }}>{info.title}</h4>
            <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.9rem' }}>{info.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="admin-btn" onClick={() => handleMove(index, 'up')} disabled={index===0} style={{ padding: '4px 10px', fontSize: '1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↑</button>
              <button className="admin-btn" onClick={() => handleMove(index, 'down')} disabled={index===orgInfo.filter(i=>i.type==='aboutSnehita').length-1} style={{ padding: '4px 10px', fontSize: '1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↓</button>
              <button className="admin-btn" onClick={() => handleEdit(info)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Edit</button>
              <button className="admin-btn admin-btn-delete" onClick={() => handleDelete(info.id)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generic single role manager (Director, Dean)
const TeamRoleManager = ({ role, data, refresh }) => {
  const [form, setForm] = useState({
    name: '', designation: '', email: '', telephoneNo: '', message: '', image: '', type: role
  });
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      let textMessage = data.message || '';
      if (textMessage.startsWith('[')) {
        try {
          const parsed = JSON.parse(textMessage);
          if (Array.isArray(parsed)) textMessage = parsed.join('\n');
        } catch(e) {}
      }
      setForm({ ...data, message: textMessage });
    }
  }, [data]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => { setTempImageSrc(reader.result); setShowCropper(true); };
      reader.readAsDataURL(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async (croppedBase64) => {
    setShowCropper(false);
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const uploadData = new FormData();
      uploadData.append("image", file);

      const uploadRes = await axios.post(`${BASE_URL}/api/admin/upload`, uploadData, { withCredentials: true });
      setForm(prev => ({ ...prev, image: uploadRes.data.imageUrl }));
      toast.success("Image uploaded!");
    } catch (error) { toast.error("Upload failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.message && !payload.message.startsWith('[')) {
      payload.message = JSON.stringify(payload.message.split('\n').filter(l => l.trim()));
    }
    try {
      if (data && data.id) {
        await axios.put(`${BASE_URL}/api/admin/team/${data.id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${BASE_URL}/api/admin/team`, payload, { withCredentials: true });
      }
      toast.success("Saved successfully");
      refresh();
    } catch (err) { toast.error("Save failed"); }
  };

  return (
    <div className="admin-card">
      <h3>Manage {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {form.image && <img src={form.image.startsWith('http') ? form.image : `${BASE_URL}${form.image}`} alt="Preview" className="profile-pic-preview" />}
          <div className="admin-form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="admin-input" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Designation</label>
            <input required type="text" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="admin-input" />
          </div>
        </div>

        <div className="admin-form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="admin-input" />
        </div>

        <div className="admin-form-group">
          <label>Message/Text</label>
          <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="admin-textarea" />
        </div>

        <button type="submit" className="admin-btn">Save Changes</button>
      </form>

      {showCropper && tempImageSrc && (
        <ImageCropperModal imageSrc={tempImageSrc} onComplete={handleCropComplete} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  );
};

// Faculty Manager (List & Add)
const FacultyManager = ({ team, refresh }) => {
  // Can be implemented remarkably similar to ManageCounselors since both handle lists.
  // For brevity, we re-use the component style.
  const [form, setForm] = useState({ name: '', designation: '', type: 'faculty_advisor', email: '', telephoneNo: '', message: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => { setTempImageSrc(reader.result); setShowCropper(true); };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedBase64) => {
    setShowCropper(false);
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const uploadData = new FormData();
      uploadData.append("image", file);
      const uploadRes = await axios.post(`${BASE_URL}/api/admin/upload`, uploadData, { withCredentials: true });
      setForm(prev => ({ ...prev, image: uploadRes.data.imageUrl }));
      toast.success("Image uploaded!");
    } catch (error) { toast.error("Upload failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.message && !payload.message.startsWith('[')) {
      payload.message = JSON.stringify(payload.message.split('\n').filter(l => l.trim()));
    }
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/admin/team/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${BASE_URL}/api/admin/team`, payload, { withCredentials: true });
      }
      toast.success("Faculty Saved");
      setEditingId(null);
      setForm({ name: '', designation: '', type: 'faculty_advisor', email: '', telephoneNo: '', message: '', image: '' });
      refresh();
    } catch (err) { toast.error("Save failed"); }
  };

  const handleEdit = (faculty) => {
    let msg = faculty.message || '';
    if (msg.startsWith('[')) {
      try { const p = JSON.parse(msg); if(Array.isArray(p)) msg = p.join('\n'); } catch(err){}
    }
    setForm({ ...faculty, message: msg });
    setEditingId(faculty.id);
  };
  const handleDelete = async (id) => {
    if(!window.confirm("Delete Faculty?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/team/${id}`, { withCredentials: true });
      toast.success("Deleted"); refresh();
    } catch(err) { toast.error("Delete failed"); }
  };

  const handleDrop = async (e, destIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);
    if (sourceIndex === destIndex) return;
    
    let items = [...team];
    const [draggedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, draggedItem);
    
    const payload = items.map((item, index) => ({ id: item.id, order: index }));
    try {
      await axios.post(`${BASE_URL}/api/admin/team/reorder`, { items: payload }, { withCredentials: true });
      refresh(false);
      toast.success("Reordered successfully");
    } catch (err) { toast.error("Reorder failed"); }
  };

  const handleMove = async (index, direction) => {
    let items = [...team];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    const payload = items.map((item, idx) => ({ id: item.id, order: idx }));
    try {
      await axios.post(`${BASE_URL}/api/admin/team/reorder`, { items: payload }, { withCredentials: true });
      refresh(false);
    } catch (err) { toast.error("Move failed"); }
  };

  return (
    <div>
      <div className="admin-card">
        <h3>{editingId ? "Edit Faculty Advisor" : "Add Faculty Advisor"}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {form.image && <img src={form.image.startsWith('http') ? form.image : `${BASE_URL}${form.image}`} alt="Preview" className="profile-pic-preview" />}
              <div className="admin-form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="admin-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Designation</label>
                <input required type="text" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="admin-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="admin-input" />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Telephone</label>
                <input type="text" value={form.telephoneNo} onChange={e => setForm({...form, telephoneNo: e.target.value})} className="admin-input" />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Message/Text</label>
              <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="admin-textarea" />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn">Save</button>
              {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name: '', designation: '', type: 'faculty_advisor', message: '', image: ''})}} className="admin-btn" style={{backgroundColor: '#95a5a6'}}>Cancel</button>}
            </div>
        </form>
      </div>

      <div className="admin-list-container">
        {team.map((f, index) => (
          <div 
            key={f.id} 
            className="admin-listItem"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('sourceIndex', index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            style={{ cursor: 'grab' }}
          >
             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flexGrow: 1 }}>
              <img src={f.image ? (f.image.startsWith('http') ? f.image : `${BASE_URL}${f.image}`) : 'https://via.placeholder.com/100'} alt={f.name} className="profile-pic-preview" style={{width: '80px', height: '80px', margin: 0}} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{index + 1}. {f.name}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{f.designation}</p>
              </div>
            </div>
            <div className="admin-listItem-actions">
              <button className="admin-btn" onClick={() => handleMove(index, 'up')} disabled={index===0} style={{ padding: '6px 12px', fontSize: '1.1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↑</button>
              <button className="admin-btn" onClick={() => handleMove(index, 'down')} disabled={index===team.length-1} style={{ padding: '6px 12px', fontSize: '1.1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↓</button>
              <button onClick={() => handleEdit(f)} className="admin-btn" style={{padding: '5px 10px'}}>Edit</button>
              <button onClick={() => handleDelete(f.id)} className="admin-btn admin-btn-delete" style={{padding: '5px 10px'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showCropper && tempImageSrc && (
        <ImageCropperModal imageSrc={tempImageSrc} onComplete={handleCropComplete} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  );
};

export default ManageAboutUs;
