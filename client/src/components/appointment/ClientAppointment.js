import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/helper";
import "./appointment.css";

const ClientAppointment = ({ user }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: user?.person_name || "",
        mobileNumber: "",
        email: user?.email || "",
        appointmentDate: "",
        counselorName: "",
        timeSlot: "",
    });

    const [counselorsList, setCounselorsList] = useState([]);
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [counselorAvailability, setCounselorAvailability] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    useEffect(() => {
        fetchCounselors();
        fetchPreviousAppointments();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.person_name,
                email: user.email
            }));
        }
    }, [user]);

    // Fetch availability when calendar is opened
    useEffect(() => {
        if (showCalendar && formData.counselorName) {
            fetchCounselorAvailability();
        }
    }, [showCalendar, formData.counselorName]);

    const fetchCounselors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/counselors`, { withCredentials: true });
            setCounselorsList(response.data);
        } catch (error) {
            console.error("Error fetching counselors:", error);
            toast.error("Error fetching counselors list");
        }
    };

    const fetchPreviousAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/data`, { withCredentials: true });
            if (Array.isArray(response.data)) {
                setPreviousAppointments(response.data);
            } else {
                setPreviousAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching previous appointments:", error);
            setPreviousAppointments([]);
        }
    };

    const fetchCounselorAvailability = async () => {
        setLoadingAvailability(true);
        console.log("Fetching availability for:", formData.counselorName);
        console.log("Using URL:", `${BASE_URL}/public-availability`);

        try {
            const response = await axios.get(`${BASE_URL}/public-availability`, {
                params: { counselorName: formData.counselorName },
                withCredentials: true
            });
            console.log("Availability response:", response.data);
            setCounselorAvailability(response.data);
        } catch (error) {
            console.error("Error fetching availability:", error);
            if (error.response) {
                console.error("Server responded with:", error.response.status, error.response.data);
                toast.error(`Error: ${error.response.data.msg || "Server Error"}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response from server. Check network.");
            } else {
                console.error("Request setup error:", error.message);
                toast.error("Request setup failed.");
            }
        } finally {
            setLoadingAvailability(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSlotSelect = (date, slot) => {
        setFormData(prev => ({
            ...prev,
            appointmentDate: date,
            timeSlot: slot
        }));
        setShowCalendar(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.appointmentDate || !formData.timeSlot) {
            toast.warn("Please choose a date and time slot");
            return;
        }

        if (formData.mobileNumber.toString().length !== 10) {
            toast.error("Enter 10 digit number!");
            return;
        }

        // Check for duplicate booking
        const selectedDate = new Date(formData.appointmentDate);
        if (Array.isArray(previousAppointments)) {
            const isDuplicate = previousAppointments.some(appt =>
                new Date(appt.appointmentDate).toDateString() === selectedDate.toDateString() &&
                appt.status !== 'rejected'
            );

            if (isDuplicate) {
                toast.error(`You have already booked an appointment on ${selectedDate.toDateString()}!`);
                return;
            }
        }

        navigate("/otherinfo", { state: { formData: formData } });
    };

    return (
        <div className="BODY">
            <div className="appointment">
                <div className="form" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <h2>Book Appointment</h2>

                        <div className="input-box">
                            <FaUser className="fa" />
                            <input type="text" name="fullName" value={formData.fullName} placeholder="Full Name" onChange={handleInputChange} required />
                        </div>
                        <div className="input-box">
                            <FaPhone className="fa" />
                            <input type="number" name="mobileNumber" value={formData.mobileNumber} placeholder="Mobile Number" onChange={handleInputChange} required />
                        </div>

                        <div className="input-box">
                            <FaEnvelope className="fa" />
                            <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleInputChange} required />
                        </div>

                        <div className="input-box">
                            <select
                                name="counselorName"
                                value={formData.counselorName}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setFormData(prev => ({ ...prev, appointmentDate: "", timeSlot: "" })); // Reset slot on counselor change
                                }}
                                required
                                className="counselor-select"
                            >
                                <option value="">Choose Counsellor</option>
                                {counselorsList.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-box text-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => {
                                    if (!formData.counselorName) {
                                        toast.warn("Please select a counselor first");
                                        return;
                                    }
                                    setShowCalendar(true);
                                }}
                            >
                                <FaCalendarAlt />
                                {formData.appointmentDate && formData.timeSlot
                                    ? `${new Date(formData.appointmentDate).toLocaleDateString()} at ${formData.timeSlot}`
                                    : "Choose Date & Time Slot"}
                            </button>
                        </div>

                        <div className="input-box mt-4">
                            <input type="submit" value="Next" />
                        </div>
                    </form>
                </div>

                {/* Calendar Selection Modal */}
                {showCalendar && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Select Time Slot for {formData.counselorName}</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowCalendar(false)}></button>
                                </div>
                                <div className="modal-body p-0">
                                    {loadingAvailability ? (
                                        <div className="text-center p-5">Loading schedule...</div>
                                    ) : (
                                        <div className="calendar-view">
                                            <div className="table-responsive">
                                                <table className="table table-bordered text-center calendar-table mb-0">
                                                    <thead className="table-light sticky-top">
                                                        <tr>
                                                            <th style={{ minWidth: '100px' }}>Date</th>
                                                            <th>9 AM - 10 AM</th>
                                                            <th>10 AM - 11 AM</th>
                                                            <th>11 AM - 12 PM</th>
                                                            <th>12 PM - 1 PM</th>
                                                            <th className="bg-secondary text-white">1 PM - 2 PM</th>
                                                            <th>2 PM - 3 PM</th>
                                                            <th>3 PM - 4 PM</th>
                                                            <th>4 PM - 5 PM</th>
                                                            <th>5 PM - 6 PM</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                                            const date = new Date();
                                                            date.setDate(date.getDate() + dayIndex);
                                                            const dateString = date.toLocaleDateString(); // MM/DD/YYYY or similar depending on locale
                                                            // ISO string for data comparison and storage: YYYY-MM-DD
                                                            const isoDate = date.toISOString().split('T')[0];
                                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                                                            const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

                                                            return (
                                                                <tr key={dayIndex}>
                                                                    <td className="fw-bold bg-light align-middle">
                                                                        {dateString} <br /> <small className="text-muted">{dayName}</small>
                                                                    </td>
                                                                    {timeSlots.map(hour => {
                                                                        if (hour === 13) {
                                                                            return <td key={hour} className="bg-secondary text-white align-middle">Lunch Break</td>;
                                                                        }

                                                                        const hour12 = hour > 12 ? hour - 12 : hour;
                                                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                                                        const slotString = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;

                                                                        // Check if booked
                                                                        // API returns appointments with { appointmentDate, timeSlot }
                                                                        const isBooked = counselorAvailability.some(appt => {
                                                                            // Ideally backend returns full ISO timestamp or consistent date string
                                                                            // The appt.appointmentDate from Sequelize usually implies 00:00:00 time
                                                                            const apptDateObj = new Date(appt.appointmentDate);
                                                                            const apptIsoDate = apptDateObj.toISOString().split('T')[0];
                                                                            // Compare dates and verify slot starts with our hour
                                                                            // Slot format "09:00 AM - 10:00 AM"
                                                                            return apptIsoDate === isoDate && appt.timeSlot.startsWith(slotString);
                                                                        });

                                                                        return (
                                                                            <td
                                                                                key={hour}
                                                                                className={`align-middle ${isBooked ? 'bg-danger text-white' : 'clickable-slot'}`}
                                                                                onClick={() => !isBooked && handleSlotSelect(isoDate, `${slotString} - ${hour12 + 1 > 12 ? hour12 + 1 - 12 : hour12 + 1}:00 ${hour + 1 >= 12 ? 'PM' : 'AM'}`)}
                                                                                style={{ cursor: isBooked ? 'not-allowed' : 'pointer', height: '60px' }}
                                                                            >
                                                                                {isBooked ? "Booked" : "Free"}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="form2" style={{ marginTop: '20px' }}>
                    <div className="previous-appointments">
                        <h2>My Appointments</h2>
                        {previousAppointments.length > 0 ? (
                            <table className="previous-appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Counselor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previousAppointments.map((appt) => (
                                        <tr key={appt.id}>
                                            <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                            <td>{appt.timeSlot}</td>
                                            <td>{appt.counselorName}</td>
                                            <td>
                                                <span className={`badge ${appt.status === 'approved' ? 'bg-success' : appt.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                                                    {appt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No previous appointments found.</p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ClientAppointment;
