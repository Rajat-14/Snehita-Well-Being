import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { toast, ToastContainer } from 'react-toastify';

const ManageUsefulLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', type: 'link', url: ''
  });
  
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/useful-links`, { withCredentials: true });
      setLinks(res.data);
    } catch (error) {
      toast.error("Failed to load useful links.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const img = new window.Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Only block portrait/square images — they look wrong in a horizontal banner
      if (width <= height) {
        toast.error("Please upload a horizontal (landscape) image. Vertical or square images will distort the layout.");
        e.target.value = "";
        setFile(null);
      } else {
        // Accept any landscape image regardless of its exact aspect ratio
        setFile(selectedFile);
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      toast.error("Invalid image file selected.");
      e.target.value = "";
      setFile(null);
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required.");
    if (formData.type === 'link' && !isEditing && !file) return toast.error("Image is required for type 'link'.");

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("type", formData.type);
    uploadData.append("url", formData.url);
    if (file) {
      uploadData.append("pic", file);
    }

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/api/useful-links/${currentId}`, uploadData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Link updated successfully.");
      } else {
        await axios.post(`${BASE_URL}/api/useful-links`, uploadData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Link added successfully.");
      }
      resetForm();
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save link.");
    }
  };

  const handleEdit = (link) => {
    setFormData({
      title: link.title || '',
      type: link.type || 'link',
      url: link.url || ''
    });
    setFile(null); // Clear pending file
    setCurrentId(link.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/useful-links/${id}`, { withCredentials: true });
      toast.success("Link deleted.");
      fetchLinks();
    } catch (error) {
      toast.error("Failed to delete link.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', type: 'link', url: '' });
    setFile(null);
    setIsEditing(false);
    setCurrentId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer />
      <div className="admin-section-header">Manage Useful Links</div>

      <div className="admin-card">
        <h3>{isEditing ? "Edit Link" : "Add New Link"}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="admin-input" placeholder="e.g. TeleMANAS" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="admin-input">
                <option value="link">Website Link (requires Image)</option>
                <option value="phone">Helpline Phone (Icon only)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
             <div className="admin-form-group" style={{ flex: 1 }}>
              <label>URL / Phone Number</label>
              <input type="text" name="url" value={formData.url} onChange={handleInputChange} className="admin-input" placeholder={formData.type === 'link' ? "https://telemanas.mohfw.gov.in" : "14416"} />
            </div>
            {formData.type === 'link' && (
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Logo / Image {isEditing && "(Leave blank to keep existing)"}</label>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="admin-input" />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">{isEditing ? "Update Link" : "Add Link"}</button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="admin-btn" style={{ backgroundColor: '#95a5a6' }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list-container">
        {links.map((link, index) => (
          <div key={link.id} className="admin-listItem">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flexGrow: 1 }}>
              {link.type === 'link' ? (
                <img 
                  src={link.pic ? `${BASE_URL}/uploads/useful-links/${link.pic}` : 'https://via.placeholder.com/100'} 
                  alt={link.title} 
                  className="profile-pic-preview" 
                  style={{ width: '80px', height: '80px', margin: 0, objectFit: 'contain' }} 
                />
              ) : (
                <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', borderRadius: '8px' }}>
                  📞
                </div>
              )}
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{link.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Type: {link.type}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>URL/Phone: {link.url}</p>
              </div>
            </div>
            <div className="admin-listItem-actions">
              <button onClick={() => handleEdit(link)} className="admin-btn" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Edit</button>
              <button onClick={() => handleDelete(link.id)} className="admin-btn admin-btn-delete" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {links.length === 0 && <p>No entries added yet.</p>}
      </div>
    </div>
  );
};

export default ManageUsefulLinks;
