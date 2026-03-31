import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { toast, ToastContainer } from 'react-toastify';
import ImageCropperModal from '../common/ImageCropperModal';

const ManageCounselors = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', designation: '', type: 'counsellor', email: '', telephoneNo: '', message: '', experience: '', image: '', location: ''
  });

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/team`, { withCredentials: true });
      const relevant = res.data.filter(t => t.type === 'counsellor');
      setCounselors(relevant);
    } catch (error) {
      toast.error("Failed to load counselors.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async (croppedBase64) => {
    setShowCropper(false);
    try {
      // Upload Base64 to get URL
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const uploadData = new FormData();
      uploadData.append("image", file);

      const uploadRes = await axios.post(`${BASE_URL}/api/admin/upload`, uploadData, { withCredentials: true });
      setFormData(prev => ({ ...prev, image: uploadRes.data.imageUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required.");
    
    // Convert message back to JSON array for database
    const payload = { ...formData };
    if (payload.message && !payload.message.startsWith('[')) {
      payload.message = JSON.stringify(payload.message.split('\n').filter(l => l.trim()));
    }

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/api/admin/team/${currentId}`, payload, { withCredentials: true });
        toast.success("Counselor updated successfully.");
      } else {
        await axios.post(`${BASE_URL}/api/admin/team`, payload, { withCredentials: true });
        toast.success("Counselor added successfully.");
      }
      resetForm();
      fetchCounselors();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save counselor.");
    }
  };

  const handleEdit = (counselor) => {
    // Parse message back to text blob
    let textMessage = counselor.message || '';
    if (textMessage.startsWith('[')) {
      try {
        const parsed = JSON.parse(textMessage);
        if (Array.isArray(parsed)) textMessage = parsed.join('\n');
      } catch (err) {}
    }
    setFormData({
      name: counselor.name || '',
      designation: counselor.designation || '',
      type: 'counsellor',
      email: counselor.email || '',
      telephoneNo: counselor.telephoneNo || '',
      message: textMessage,
      experience: counselor.experience || '',
      image: counselor.image || '',
      location: counselor.location || ''
    });
    setCurrentId(counselor.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this counselor?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/team/${id}`, { withCredentials: true });
      toast.success("Counselor deleted.");
      fetchCounselors();
    } catch (error) {
      toast.error("Failed to delete counselor.");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', designation: '', type: 'counsellor', email: '', telephoneNo: '', message: '', experience: '', image: '', location: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleDrop = async (e, destIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);
    if (sourceIndex === destIndex) return;
    
    let items = [...counselors];
    const [draggedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, draggedItem);
    
    const payload = items.map((item, index) => ({ id: item.id, order: index }));
    try {
      await axios.post(`${BASE_URL}/api/admin/team/reorder`, { items: payload }, { withCredentials: true });
      fetchCounselors(false);
      toast.success("Reordered successfully");
    } catch (err) { toast.error("Reorder failed"); }
  };

  const handleMove = async (index, direction) => {
    let items = [...counselors];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    const payload = items.map((item, idx) => ({ id: item.id, order: idx }));
    try {
      await axios.post(`${BASE_URL}/api/admin/team/reorder`, { items: payload }, { withCredentials: true });
      fetchCounselors(false);
    } catch (err) { toast.error("Move failed"); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer />
      <div className="admin-section-header">Manage Counselors</div>

      <div className="admin-card">
        <h3>{isEditing ? "Edit Counselor" : "Add New Counselor"}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {formData.image && (
              <img 
                src={formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `${BASE_URL}${formData.image}`} 
                alt="Profile Preview" 
                className="profile-pic-preview" 
              />
            )}
            <div className="admin-form-group">
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="admin-input" />
              <small style={{ color: '#888' }}>Select an image to open cropper. (Ideal 1:1 Aspect Ratio)</small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="admin-input" placeholder="e.g. Dr. John Doe" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Designation</label>
              <input required type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="admin-input" placeholder="e.g. Senior Counselor" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
             <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Email (Important for System Login)</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="admin-input" placeholder="john@domain.com" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Telephone</label>
              <input type="text" name="telephoneNo" value={formData.telephoneNo} onChange={handleInputChange} className="admin-input" placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="admin-input" placeholder="e.g. Room 101, Main Building" />
          </div>

          <div className="admin-form-group">
            <label>Experience / Description (Displayed on Team pages)</label>
            <textarea name="experience" value={formData.experience} onChange={handleInputChange} className="admin-textarea" placeholder="Enter short description or experience..." />
          </div>

          <div className="admin-form-group">
            <label>Message / Long Description (Displayed in About Us)</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange} className="admin-textarea" placeholder="Enter message text... New lines are respected." />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">{isEditing ? "Update Counselor" : "Add Counselor"}</button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="admin-btn" style={{ backgroundColor: '#95a5a6' }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list-container">
        {counselors.map((c, index) => (
          <div 
            key={c.id} 
            className="admin-listItem"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('sourceIndex', index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            style={{ cursor: 'grab' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flexGrow: 1 }}>
              <img 
                src={c.image ? (c.image.startsWith('http') ? c.image : `${BASE_URL}${c.image}`) : 'https://via.placeholder.com/100'} 
                alt={c.name} 
                className="profile-pic-preview" 
                style={{ width: '80px', height: '80px', margin: 0 }} 
              />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{index + 1}. {c.name}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{c.designation}</p>
              </div>
            </div>
            <div className="admin-listItem-actions">
              <button className="admin-btn" onClick={() => handleMove(index, 'up')} disabled={index===0} style={{ padding: '6px 12px', fontSize: '1.1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↑</button>
              <button className="admin-btn" onClick={() => handleMove(index, 'down')} disabled={index===counselors.length-1} style={{ padding: '6px 12px', fontSize: '1.1rem', backgroundColor: '#e2e8f0', color: '#333' }}>↓</button>
              <button onClick={() => handleEdit(c)} className="admin-btn" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Edit</button>
              <button onClick={() => handleDelete(c.id)} className="admin-btn admin-btn-delete" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {counselors.length === 0 && <p>No counselors added yet.</p>}
      </div>

      {showCropper && tempImageSrc && (
        <ImageCropperModal 
          imageSrc={tempImageSrc} 
          onComplete={handleCropComplete} 
          onCancel={() => {
            setShowCropper(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }} 
        />
      )}
    </div>
  );
};

export default ManageCounselors;
