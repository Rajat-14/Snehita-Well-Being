import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../services/helper";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        person_name: "",
        email: "",
        mobileNumber: "",
        gender: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Fetch user info
        const getUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/login/success`, {
                    withCredentials: true,
                });
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
                }
            } catch (error) {
                navigate("/login");
            }
        };
        getUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await axios.put(`${BASE_URL}/user/profile`, formData, {
                withCredentials: true
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mt-5 mb-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "500px" }}>
                <h3 className="text-center mb-4 text-primary">My Profile</h3>
                <p className="text-muted text-center mb-4">
                    Please provide your mobile number and gender to streamline your appointment booking process.
                </p>
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.person_name}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Mobile Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="Enter 10-digit mobile number"
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Gender</label>
                        <select
                            className="form-select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;
