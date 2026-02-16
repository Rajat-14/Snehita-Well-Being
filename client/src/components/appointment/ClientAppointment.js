import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCalendar, FaInfoCircle, FaClock, FaVenusMars, FaNotesMedical } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { appointmentSubmitted } from "../../redux/actions/actions";
import { BASE_URL } from "../services/helper";
import "./appointment.css"; // Reusing existing CSS

const timeSlots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

const ClientAppointment = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullName: user?.person_name || "",
        mobileNumber: "",
        email: user?.email || "",
        appointmentDate: "",
        counselorName: "",
        timeSlot: "",
    });

    const [availableSlots, setAvailableSlots] = useState(timeSlots);
    const [counselorsList, setCounselorsList] = useState([]);
    const [previousAppointments, setPreviousAppointments] = useState([]);

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

    useEffect(() => {
        if (!formData.counselorName || !formData.appointmentDate) {
            setAvailableSlots([]);
            return;
        }
        fetchBookedSlots();
    }, [formData.counselorName, formData.appointmentDate]);

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
                console.warn("Expected array for appointments, got:", response.data);
                setPreviousAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching previous appointments:", error);
            setPreviousAppointments([]);
        }
    };

    const fetchBookedSlots = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/bookedSlots`, {
                params: {
                    counselorName: formData.counselorName,
                    appointmentDate: formData.appointmentDate,
                },
                withCredentials: true,
            });

            const booked = response.data;
            if (booked) {
                const newAvailableSlots = timeSlots.filter(
                    (slot) => !booked.includes(slot)
                );
                setAvailableSlots(newAvailableSlots);
            }
        } catch (error) {
            console.error("Error fetching booked slots:", error);
            toast.error("Error fetching booked slots");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit clicked. Data:", formData);

        const today = new Date();
        const selectedDate = new Date(formData.appointmentDate);

        // Normalize 'today' to midnight to compare only dates
        const todayMid = new Date();
        todayMid.setHours(0, 0, 0, 0);

        // Simple string comparison as backup if timezone math gets hairy
        // Use local date for today to avoid timezone issues (e.g. UTC shifting to next/prev day)
        const offset = new Date().getTimezoneOffset() * 60000;
        const localISODate = new Date(Date.now() - offset).toISOString().split('T')[0];
        if (formData.appointmentDate < localISODate) {
            console.log("Date check failed:", formData.appointmentDate, "<", localISODate);
            toast.warn("Please choose a date starting from today");
            return;
        }

        if (formData.mobileNumber.toString().length !== 10) {
            console.log("Mobile check failed:", formData.mobileNumber);
            toast.error("Enter 10 digit number!");
            return;
        }

        // Check for duplicate booking on same date
        if (Array.isArray(previousAppointments)) {
            const isDuplicate = previousAppointments.some(appt =>
                new Date(appt.appointmentDate).toDateString() === selectedDate.toDateString() &&
                appt.status !== 'rejected'
            );

            if (isDuplicate) {
                console.log("Duplicate booking found");
                toast.error(`You have already booked an appointment on ${selectedDate.toDateString()}!`);
                return;
            }
        }

        console.log("Validation passed. Navigating to /otherinfo with state:", formData);
        // Navigate to next step
        try {
            navigate("/otherinfo", { state: { formData: formData } });
            console.log("Navigate called.");
        } catch (err) {
            console.error("Navigation failed:", err);
        }
    };

    return (
        <div className="BODY">
            <div className="appointment">
                <div className="form" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                            <FaCalendar className="fa" />
                            <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} required />
                        </div>

                        <div className="input-box">
                            <select
                                name="counselorName"
                                value={formData.counselorName}
                                onChange={handleInputChange}
                                required
                                className="counselor-select"
                            >
                                <option value="">
                                    Choose Counsellor
                                </option>

                                {counselorsList.map((c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="input-box">
                            <FaClock className="fa" />
                            <select
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleInputChange}
                                required
                                className="time-slot-select"
                            >
                                <option value="">
                                    Choose Time Slot
                                </option>

                                {!formData.counselorName || !formData.appointmentDate ? (
                                    <option disabled>Choose date and counsellor first</option>
                                ) : availableSlots.length > 0 ? (
                                    availableSlots.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No slots available</option>
                                )}
                            </select>

                        </div>

                        <div className="input-box">
                            <input type="submit" value="Next" />
                        </div>
                    </form>
                </div>

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
