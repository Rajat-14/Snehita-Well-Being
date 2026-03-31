import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../services/helper";

/* ─── Image URL helpers — exact same logic as the public pages ─── */

// Achievements: ourWork.js does `${apiUrl}/uploads/achievements/${achievement.image}`
// So the DB stores just the filename for old rows.
// New uploads via admin return a full path like "/uploads/achievements/12345.jpg".
const getAchievementImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith("/uploads/")) return `${BASE_URL}${image}`; // new format
    return `${BASE_URL}/uploads/achievements/${image}`;               // legacy filename
};

// Testimonials: testimonial.js uses require(`../../assets/Testimonies/${pic}`) for legacy.
// New uploads return "/uploads/testimonials/..."
const getTestimonialImageSrc = (pic, fallback = null) => {
    if (!pic) return fallback;
    if (pic.startsWith("/uploads/")) return `${BASE_URL}${pic}`; // new format
    // Legacy filename stored without path — bundled by Webpack on the frontend
    try {
        return require(`../../assets/Testimonies/${pic}`);
    } catch {
        return fallback;
    }
};

/* ──────────────────────────────────────────────────────────────────
   Testimonial image dimensions from testimonial.css: 136×136 circle
   Achievement image: landscape card-img-top, ideally ~4:3 ratio
────────────────────────────────────────────────────────────────── */

const ManageHome = () => {
    const [activeSection, setActiveSection] = useState("achievements");

    return (
        <div>
            <h3 className="mb-3 border-bottom pb-2">Manage Home Section</h3>

            {/* Sub-tabs */}
            <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeSection === "achievements" ? "active" : ""}`}
                        onClick={() => setActiveSection("achievements")}
                    >
                        🏆 Achievements
                    </button>
                </li>
                <li className="nav-item ms-2">
                    <button
                        className={`nav-link ${activeSection === "testimonials" ? "active" : ""}`}
                        onClick={() => setActiveSection("testimonials")}
                    >
                        💬 Testimonials
                    </button>
                </li>
            </ul>

            {activeSection === "achievements" && <ManageAchievements />}
            {activeSection === "testimonials" && <ManageTestimonials />}

            <ToastContainer position="bottom-right" autoClose={2500} />
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   ACHIEVEMENTS MANAGER
═══════════════════════════════════════════════════════ */
const ManageAchievements = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", image: "", order: 0 });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef();

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/achievements`, { withCredentials: true });
            setItems(res.data);
        } catch { toast.error("Failed to load achievements"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchItems(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setForm({ title: "", description: "", image: "", order: items.length });
        setImageFile(null); setImagePreview(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ title: item.title, description: item.description, image: item.image || "", order: item.order || 0 });
        setImageFile(null);
        setImagePreview(item.image ? getAchievementImageSrc(item.image) : null);
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return form.image;
        setUploading(true);
        const fd = new FormData();
        fd.append("image", imageFile);
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/upload/achievement`, fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.imageUrl;
        } catch { toast.error("Image upload failed"); return form.image; }
        finally { setUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const imageUrl = await uploadImage();
            const payload = { ...form, image: imageUrl };
            if (editItem) {
                await axios.put(`${BASE_URL}/api/admin/achievement/${editItem.id}`, payload, { withCredentials: true });
                toast.success("Achievement updated!");
            } else {
                await axios.post(`${BASE_URL}/api/admin/achievement`, payload, { withCredentials: true });
                toast.success("Achievement added!");
            }
            setShowForm(false);
            fetchItems();
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this achievement?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/achievement/${id}`, { withCredentials: true });
            toast.success("Deleted!");
            fetchItems();
        } catch { toast.error("Delete failed"); }
    };

    if (loading) return <div className="text-center p-5">Loading achievements…</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Achievements <span className="badge bg-secondary">{items.length}</span></h5>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Achievement</button>
            </div>

            {/* Image size hint */}
            <p className="text-muted small mb-3">
                💡 Achievement images are displayed as card thumbnails (~16:9 landscape). Recommended size: <strong>800 × 450 px</strong>.
            </p>

            {/* Grid of achievements */}
            <div className="row g-3">
                {items.map(item => (
                    <div key={item.id} className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            {item.image && (
                                <img
                                    src={getAchievementImageSrc(item.image)}
                                    className="card-img-top"
                                    alt={item.title}
                                    style={{ height: "180px", objectFit: "cover" }}
                                />
                            )}
                            {!item.image && (
                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                                    <span className="text-muted">No image</span>
                                </div>
                            )}
                            <div className="card-body">
                                <h6 className="card-title fw-bold">{item.title}</h6>
                                <p className="card-text small text-muted" style={{ maxHeight: "60px", overflow: "hidden" }}>{item.description}</p>
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-outline-primary btn-sm flex-fill" onClick={() => openEdit(item)}>Edit</button>
                                    <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => handleDelete(item.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center text-muted py-5">No achievements yet. Click "+ Add Achievement" to begin.</div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050, overflowY: "auto" }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editItem ? "Edit Achievement" : "Add Achievement"}</h5>
                                <button className="btn-close" onClick={() => setShowForm(false)} />
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body" style={{ overflowY: "auto", maxHeight: "70vh" }}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Title *</label>
                                        <input
                                            className="form-control"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description *</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Display Order</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ width: "120px" }}
                                            value={form.order}
                                            onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Image <small className="text-muted fw-normal">(Landscape ~800×450 px recommended)</small>
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <div className="mt-3">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "220px",
                                                        objectFit: "cover",
                                                        borderRadius: "6px",
                                                        border: "1px solid #dee2e6"
                                                    }}
                                                />
                                                <p className="text-muted small mt-1">Preview (as shown on the website card)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                                        {saving || uploading ? "Saving…" : (editItem ? "Save Changes" : "Add Achievement")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS MANAGER
   Images are 136×136 px, circular crop
═══════════════════════════════════════════════════════ */
const ManageTestimonials = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: "", testimony: "", pic: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/testimonials`, { withCredentials: true });
            setItems(res.data);
        } catch { toast.error("Failed to load testimonials"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchItems(); }, []);

    // Use shared helper
    const getImageUrl = (pic) => getTestimonialImageSrc(pic, null);

    const openAdd = () => {
        setEditItem(null);
        setForm({ name: "", testimony: "", pic: "" });
        setImageFile(null); setImagePreview(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ name: item.name || "", testimony: item.testimony, pic: item.pic || "" });
        setImageFile(null);
        setImagePreview(getTestimonialImageSrc(item.pic, null));
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return form.pic;
        setUploading(true);
        const fd = new FormData();
        fd.append("image", imageFile);
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/upload/testimonial`, fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.imageUrl;
        } catch { toast.error("Image upload failed"); return form.pic; }
        finally { setUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const picUrl = await uploadImage();
            const payload = { ...form, pic: picUrl };
            if (editItem) {
                await axios.put(`${BASE_URL}/api/admin/testimonial/${editItem.id}`, payload, { withCredentials: true });
                toast.success("Testimonial updated!");
            } else {
                await axios.post(`${BASE_URL}/api/admin/testimonial`, payload, { withCredentials: true });
                toast.success("Testimonial added!");
            }
            setShowForm(false);
            fetchItems();
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/testimonial/${id}`, { withCredentials: true });
            toast.success("Deleted!");
            fetchItems();
        } catch { toast.error("Delete failed"); }
    };

    if (loading) return <div className="text-center p-5">Loading testimonials…</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Testimonials <span className="badge bg-secondary">{items.length}</span></h5>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Testimonial</button>
            </div>

            {/* Image size hint */}
            <p className="text-muted small mb-3">
                💡 Testimonial photos are displayed as <strong>136×136 px circles</strong>. Upload a square photo for best results. The preview below shows the circular crop.
            </p>

            {/* Grid of testimonials */}
            <div className="row g-3">
                {items.map(item => (
                    <div key={item.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    {getImageUrl(item.pic) ? (
                                        <img
                                            src={getImageUrl(item.pic)}
                                            alt={item.name}
                                            style={{
                                                width: "64px",
                                                height: "64px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "2px solid #dee2e6",
                                                flexShrink: 0
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: "64px", height: "64px", borderRadius: "50%",
                                            background: "#e9ecef", flexShrink: 0,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#adb5bd", fontSize: "20px"
                                        }}>
                                            👤
                                        </div>
                                    )}
                                    <div>
                                        <h6 className="mb-0 fw-bold">{item.name || "Anonymous"}</h6>
                                        {item.pic && item.pic.startsWith("/assets") && (
                                            <small className="text-warning">⚠ Legacy local image</small>
                                        )}
                                    </div>
                                </div>
                                <p className="small text-muted" style={{ maxHeight: "72px", overflow: "hidden" }}>
                                    "{item.testimony}"
                                </p>
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-outline-primary btn-sm flex-fill" onClick={() => openEdit(item)}>Edit</button>
                                    <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => handleDelete(item.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center text-muted py-5">No testimonials yet. Click "+ Add Testimonial" to begin.</div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editItem ? "Edit Testimonial" : "Add Testimonial"}</h5>
                                <button className="btn-close" onClick={() => setShowForm(false)} />
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body" style={{ overflowY: "auto", maxHeight: "70vh" }}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Name <small className="text-muted fw-normal">(leave blank for Anonymous)</small></label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g. Priya Sharma"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Testimony *</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={form.testimony}
                                            onChange={e => setForm({ ...form, testimony: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Photo <small className="text-muted fw-normal">(Shown as 136×136 circle — use a square photo)</small>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />

                                        {/* Circular crop preview */}
                                        {imagePreview && (
                                            <div className="mt-3 d-flex align-items-center gap-4">
                                                {/* Actual circle preview at display size */}
                                                <div>
                                                    <p className="text-muted small mb-1">Circle preview (as shown on website):</p>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Circle preview"
                                                        style={{
                                                            width: "136px",
                                                            height: "136px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            border: "3px solid #dee2e6",
                                                            boxShadow: "-4px 4px 6px rgba(0,0,0,0.18)"
                                                        }}
                                                    />
                                                </div>
                                                {/* Small circle preview */}
                                                <div>
                                                    <p className="text-muted small mb-1">Thumbnail (in admin list):</p>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Thumbnail"
                                                        style={{
                                                            width: "64px",
                                                            height: "64px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            border: "2px solid #dee2e6"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                                        {saving || uploading ? "Saving…" : (editItem ? "Save Changes" : "Add Testimonial")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageHome;
