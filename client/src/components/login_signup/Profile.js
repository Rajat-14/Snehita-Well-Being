import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../services/helper";
import { useNavigate } from "react-router-dom";
import ImageCropperModal from "../common/ImageCropperModal";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=03a9f4&color=fff&size=128&name=";

// Convert base64 data URL → Blob for multipart upload
const dataUrlToBlob = (dataUrl) => {
    const [header, base64Data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mime });
};

const Profile = ({ user }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef();
    const [formData, setFormData] = useState({
        person_name: "",
        email: "",
        mobileNumber: "",
        gender: ""
    });
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Cropper state
    const [rawImageSrc, setRawImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/login/success`, { withCredentials: true });
                const fetchedUser = response.data.user;
                if (!fetchedUser) {
                    navigate("/login");
                } else {
                    setFormData({
                        person_name: fetchedUser.person_name || "",
                        email: fetchedUser.email || "",
                        mobileNumber: fetchedUser.mobileNumber || "",
                        gender: fetchedUser.gender || ""
                    });
                    if (fetchedUser.profilePic) {
                        setProfilePicUrl(fetchedUser.profilePic); // Already a base64 data URL
                    }
                }
            } catch (error) {
                navigate("/login");
            }
        };
        getUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Step 1: User picks a file → open cropper
    const handlePhotoFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { toast.error("Photo must be under 10MB."); return; }
        setRawImageSrc(URL.createObjectURL(file));
        setShowCropper(true);
        e.target.value = "";
    };

    // Step 2: Crop done → upload to backend
    const handleCropComplete = async (dataUrl) => {
        setShowCropper(false);
        setRawImageSrc(null);
        setUploading(true);
        try {
            const blob = dataUrlToBlob(dataUrl);
            const formDataUpload = new FormData();
            formDataUpload.append('profilePic', blob, 'profile.jpg');
            const response = await axios.post(`${BASE_URL}/user/upload-profile-pic`, formDataUpload, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfilePicUrl(response.data.profilePic); // Base64 data URL returned from server
            toast.success("Profile photo updated!");
        } catch (error) {
            toast.error("Failed to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setRawImageSrc(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put(`${BASE_URL}/user/profile`, formData, { withCredentials: true });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const avatarUrl = profilePicUrl || `${DEFAULT_AVATAR}${encodeURIComponent(formData.person_name || 'U')}`;

    return (
        <div className="container mt-5 mb-5 d-flex justify-content-center">
            {/* Crop modal */}
            {showCropper && rawImageSrc && (
                <ImageCropperModal
                    imageSrc={rawImageSrc}
                    onComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}

            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "500px" }}>
                <h3 className="text-center mb-3 text-primary">My Profile</h3>

                {/* Profile Photo */}
                <div className="text-center mb-4">
                    <div
                        style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
                        onClick={() => fileInputRef.current.click()}
                        title="Click to change profile photo"
                    >
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            style={{
                                width: "110px",
                                height: "110px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid #03a9f4",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                            }}
                        />
                        <div style={{
                            position: "absolute", bottom: "4px", right: "4px",
                            background: "#03a9f4", borderRadius: "50%",
                            width: "28px", height: "28px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontSize: "14px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
                        }}>
                            ✎
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handlePhotoFileChange}
                    />
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                        {uploading ? "Uploading..." : "Click photo to change"}
                    </div>
                </div>

                <p className="text-muted text-center mb-4">
                    Please provide your mobile number and gender to streamline your appointment booking process.
                </p>
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input type="text" className="form-control" value={formData.person_name} disabled />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control" value={formData.email} disabled />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Mobile Number</label>
                        <input
                            type="tel" className="form-control"
                            name="mobileNumber" value={formData.mobileNumber}
                            onChange={handleChange} placeholder="Enter 10-digit mobile number"
                            pattern="[0-9]{10}" required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Gender</label>
                        <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;
