import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import "./appointment.css";

const CounselorDashboard = ({ user }) => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('pending'); // 'pending' or 'confirmed'
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [activeActionId, setActiveActionId] = useState(null); // ID of appointment with open actions dropdown
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [appointmentToReject, setAppointmentToReject] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [showPostponeConfirm, setShowPostponeConfirm] = useState(false);
    const [appointmentToPostpone, setAppointmentToPostpone] = useState(null);
    const [postponeNote, setPostponeNote] = useState("");
    const [clientProfilePic, setClientProfilePic] = useState(null);
    const [priorCounts, setPriorCounts] = useState({});
    const [historyTimeFilter, setHistoryTimeFilter] = useState('all'); // 'week', 'month', 'all'

    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
    const [slotToManage, setSlotToManage] = useState(null); // { date, timeSlot }

    // Follow-up Booking State
    const [showFollowupForm, setShowFollowupForm] = useState(false);
    const [followupData, setFollowupData] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
        appointmentDate: "",
        timeSlot: "",
        problemDescription: "",
        problemExtent: "Moderate",
        problemRelatedWith: "",
        modeOfReferral: "",
        userId: null,
        previousAppointmentId: null
    });
    const [bookingFollowup, setBookingFollowup] = useState(false);
    const [counselorAvailability, setCounselorAvailability] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [showFollowupCalendar, setShowFollowupCalendar] = useState(false);

    const openBlockConfirm = (date, slotString) => {
        setSlotToManage({ appointmentDate: date, timeSlot: slotString });
        setShowBlockConfirm(true);
    };

    const openUnblockConfirm = (date, slotString) => {
        setSlotToManage({ appointmentDate: date, timeSlot: slotString });
        setShowUnblockConfirm(true);
    };

    const confirmBlockSlot = async () => {
        if (!slotToManage) return;
        try {
            await axios.post(`${BASE_URL}/counselor/block-slot`, {
                counselorName: user.person_name,
                appointmentDate: slotToManage.appointmentDate,
                timeSlot: slotToManage.timeSlot
            }, { withCredentials: true });
            toast.success("Slot blocked successfully");
            fetchCalendarAppointments();
        } catch (error) {
            console.error("Error blocking slot:", error);
            toast.error(error.response?.data?.error || "Failed to block slot");
        } finally {
            setShowBlockConfirm(false);
            setSlotToManage(null);
        }
    };

    const confirmUnblockSlot = async () => {
        if (!slotToManage) return;
        try {
            await axios.post(`${BASE_URL}/counselor/unblock-slot`, {
                counselorName: user.person_name,
                appointmentDate: slotToManage.appointmentDate,
                timeSlot: slotToManage.timeSlot
            }, { withCredentials: true });
            toast.success("Slot unblocked successfully");
            fetchCalendarAppointments();
        } catch (error) {
            console.error("Error unblocking slot:", error);
            toast.error(error.response?.data?.error || "Failed to unblock slot");
        } finally {
            setShowUnblockConfirm(false);
            setSlotToManage(null);
        }
    };

    const [showBlockDayConfirm, setShowBlockDayConfirm] = useState(false);
    const [showUnblockDayConfirm, setShowUnblockDayConfirm] = useState(false);
    const [dayToManage, setDayToManage] = useState(null); // { date }

    const openBlockDayConfirm = (date) => {
        setDayToManage({ appointmentDate: date });
        setShowBlockDayConfirm(true);
    };

    const openUnblockDayConfirm = (date) => {
        setDayToManage({ appointmentDate: date });
        setShowUnblockDayConfirm(true);
    };

    const confirmBlockDay = async () => {
        if (!dayToManage) return;
        try {
            await axios.post(`${BASE_URL}/counselor/block-day`, {
                counselorName: user.person_name,
                appointmentDate: dayToManage.appointmentDate
            }, { withCredentials: true });
            toast.success("Day blocked successfully");
            fetchCalendarAppointments();
        } catch (error) {
            console.error("Error blocking day:", error);
            toast.error(error.response?.data?.error || "Failed to block day");
        } finally {
            setShowBlockDayConfirm(false);
            setDayToManage(null);
        }
    };

    const confirmUnblockDay = async () => {
        if (!dayToManage) return;
        try {
            await axios.post(`${BASE_URL}/counselor/unblock-day`, {
                counselorName: user.person_name,
                appointmentDate: dayToManage.appointmentDate
            }, { withCredentials: true });
            toast.success("Day unblocked successfully");
            fetchCalendarAppointments();
        } catch (error) {
            console.error("Error unblocking day:", error);
            toast.error(error.response?.data?.error || "Failed to unblock day");
        } finally {
            setShowUnblockDayConfirm(false);
            setDayToManage(null);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchPatientHistory = async (userId) => {
        setHistoryLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/counselor/patient-history/${userId}`, {
                withCredentials: true
            });
            setPatientHistory(response.data);
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load patient history");
        } finally {
            setHistoryLoading(false);
        }
    };

    const openPatientModal = (appt) => {
        setSelectedAppointment(appt);
        setShowHistoryModal(true);
        setClientProfilePic(null); // reset while loading
        if (appt.userId) {
            fetchPatientHistory(appt.userId);
            // Fetch profile pic (returned as base64 data URL)
            axios.get(`${BASE_URL}/user/profile-pic/${appt.userId}`, { withCredentials: true })
                .then(res => {
                    if (res.data.profilePic) {
                        setClientProfilePic(res.data.profilePic); // Already a data URL
                    }
                })
                .catch(() => setClientProfilePic(null));
        }
    };

    const closePatientModal = () => {
        setShowHistoryModal(false);
        setSelectedAppointment(null);
        setPatientHistory([]);
        setClientProfilePic(null);
    };

    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarAppointments, setCalendarAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
        if (showCalendar) {
            fetchCalendarAppointments();
        }
    }, [filter, showCalendar]);

    const fetchCalendarAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/counselor/appointments`, {
                params: {
                    counselorName: user.person_name,
                    status: 'confirmed,blocked',
                    timeframe: 'future' // Fetch all future confirmed/blocked for calendar
                },
                withCredentials: true,
            });
            setCalendarAppointments(response.data);
        } catch (error) {
            console.error("Error fetching calendar appointments:", error);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);

        try {
            let params = {
                counselorName: user.person_name,
            };

            // 🔥 Handle filters properly
            if (filter === 'pending') {
                params.status = 'pending';
            }
            else if (filter === 'confirmed') {
                // Upcoming appointments
                params.status = ['confirmed', 'resolved', 'followup', 'absent'];
                params.timeframe = 'future';
            }
            else if (filter === 'history') {
                // Past appointments
                params.status = ['confirmed', 'resolved', 'followup', 'absent'];
                params.timeframe = 'past';
            }

            const response = await axios.get(
                `${BASE_URL}/counselor/appointments`,
                {
                    params: params,
                    withCredentials: true,
                }
            );

            const fetched = response.data;

            setAppointments(fetched);

            // 🔥 Fetch prior appointment counts (FIXED)
            const countResults = await Promise.all(
                fetched.map(async (appt) => {
                    if (!appt.userId || !appt.appointmentDate) {
                        return { id: appt.id, count: 0 };
                    }

                    try {
                        const countRes = await axios.get(
                            `${BASE_URL}/counselor/prior-count`,
                            {
                                params: {
                                    userId: appt.userId,
                                    counselorName: user.person_name,
                                    appointmentDate: appt.appointmentDate // ✅ FIX
                                },
                                withCredentials: true,
                            }
                        );

                        return { id: appt.id, count: countRes.data.count };

                    } catch (err) {
                        console.error("Error fetching prior count:", err);
                        return { id: appt.id, count: 0 };
                    }
                })
            );

            // 🧠 Convert array → map
            const countsMap = {};
            countResults.forEach(({ id, count }) => {
                countsMap[id] = count;
            });

            setPriorCounts(countsMap);

        } catch (error) {
            console.error("Error fetching appointments:", error);

            if (error.response && error.response.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to fetch appointments");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, note = "") => {
        try {
            console.log("SENDING STATUS UPDATE:", { id, newStatus, rejectionNote: note.trim() });
            await axios.put(`${BASE_URL}/status/${id}`, { status: newStatus, rejectionNote: note.trim() }, { withCredentials: true });
            // If a rejection note was provided, save it alongside the status change
            if (note && note.trim()) {
                await axios.put(`${BASE_URL}/notes/${id}`, { notes: note.trim() }, { withCredentials: true });
            }
            toast.success(`Appointment ${newStatus}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleToggleStar = async (userId, e) => {
        e.stopPropagation();
        if (!userId) {
            toast.warn("Patient ID not found");
            return;
        }
        try {
            const res = await axios.put(`${BASE_URL}/user/star/${userId}`, {}, { withCredentials: true });
            const isStarred = res.data.isStarred;

            // Update local state without full refetch
            setAppointments(prev => {
                let updated = prev.map(appt =>
                    appt.userId === userId
                        ? { ...appt, user: { ...appt.user, isStarred: isStarred } }
                        : appt
                );

                // Revert array back to raw chronological order depending on filter tab
                updated.sort((a, b) => {
                    const dateA = new Date(String(a.appointmentDate).replace(' ', 'T')).getTime() || 0;
                    const dateB = new Date(String(b.appointmentDate).replace(' ', 'T')).getTime() || 0;
                    return filter === 'history' ? dateB - dateA : dateA - dateB;
                });

                return updated;
            });
            toast.success("Star status updated");
        } catch (error) {
            console.error("Error toggling star:", error);
            toast.error("Failed to update star status");
        }
    };

    const handleAddNote = async () => {
        if (!selectedAppointment) return;
        try {
            await axios.put(`${BASE_URL}/notes/${selectedAppointment.id}`, { notes: noteText }, { withCredentials: true });
            toast.success("Note saved successfully");
            setNoteText("");
            setSelectedAppointment(null);
            fetchAppointments();
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note");
        }
    };

    const openNoteModal = (appt) => {
        setSelectedAppointment(appt);
        setNoteText(appt.notes || "");
    };

    const toggleActions = (id, e) => {
        e.stopPropagation();
        setActiveActionId(activeActionId === id ? null : id);
    };

    const initiateReject = (appt, e) => {
        e.stopPropagation();
        setAppointmentToReject(appt);
        setShowRejectConfirm(true);
        setActiveActionId(null); // Close dropdown
    };

    const confirmReject = async () => {
        if (appointmentToReject) {
            await handleStatusUpdate(appointmentToReject.id, 'rejected', rejectNote);
            setShowRejectConfirm(false);
            setAppointmentToReject(null);
            setRejectNote("");
            // If this rejection came from the history modal, close it too
            if (showHistoryModal) closePatientModal();
        }
    };

    const cancelReject = () => {
        setShowRejectConfirm(false);
        setAppointmentToReject(null);
        setRejectNote("");
    };

    const initiatePostpone = (appt, e) => {
        e.stopPropagation();
        setAppointmentToPostpone(appt);
        setShowPostponeConfirm(true);
        setActiveActionId(null);
    };

    const confirmPostpone = async () => {
        if (appointmentToPostpone) {
            await handleStatusUpdate(appointmentToPostpone.id, 'postponed', postponeNote);
            setShowPostponeConfirm(false);
            setAppointmentToPostpone(null);
            setPostponeNote("");
            if (showHistoryModal) closePatientModal();
        }
    };

    const cancelPostpone = () => {
        setShowPostponeConfirm(false);
        setAppointmentToPostpone(null);
        setPostponeNote("");
    };

    const isAppointmentPast = (appt) => {
        if (!appt || !appt.appointmentDate || !appt.timeSlot) return false;
        const now = new Date();
        const apptDate = new Date(appt.appointmentDate);
        apptDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (apptDate < today) return true;
        if (apptDate > today) return false;

        // It's today, check time slot end
        let endTimeStr = appt.timeSlot.split('-')[1];
        if (!endTimeStr) return false;
        endTimeStr = endTimeStr.trim();
        let [time, modifier] = endTimeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return (now.getHours() > hours) || (now.getHours() === hours && now.getMinutes() >= parseInt(minutes || 0, 10));
    };

    const initiateFollowupBooking = (appt) => {
        setFollowupData({
            fullName: appt.fullName || "",
            mobileNumber: appt.mobileNumber || "",
            email: appt.email || "",
            appointmentDate: "", // Must select new
            timeSlot: "",        // Must select new
            problemDescription: appt.problemDescription || "",
            problemExtent: appt.problemExtent || "Moderate",
            problemRelatedWith: appt.problemRelatedWith || "",
            modeOfReferral: appt.modeOfReferral || "",
            age: appt.age || "",
            gender: appt.gender || "",
            userId: appt.userId,
            counselorName: user.person_name,
            previousAppointmentId: appt.id
        });
        setShowFollowupForm(true);
    };

    const handleFollowupSubmit = async (e) => {
        e.preventDefault();
        if (!followupData.appointmentDate || !followupData.timeSlot) {
            toast.warn("Please select a date and time slot");
            return;
        }
        setBookingFollowup(true);
        try {
            await axios.post(`${BASE_URL}/book-followup`, followupData, { withCredentials: true });
            toast.success("Follow-up appointment booked successfully");
            setShowFollowupForm(false);
            closePatientModal();
            fetchAppointments();
            if (showCalendar) fetchCalendarAppointments();
        } catch (error) {
            console.error("Error booking follow-up:", error);
            toast.error(error.response?.data?.error || "Failed to book follow-up");
        } finally {
            setBookingFollowup(false);
        }
    };

    const fetchCounselorAvailability = async () => {
        setLoadingAvailability(true);
        try {
            const response = await axios.get(`${BASE_URL}/public-availability`, {
                params: { counselorName: user.person_name },
                withCredentials: true
            });
            setCounselorAvailability(response.data);
        } catch (error) {
            console.error("Error fetching availability:", error);
            toast.error("Failed to fetch counselor availability");
        } finally {
            setLoadingAvailability(false);
        }
    };

    const handleFollowupSlotSelect = (date, slot) => {
        setFollowupData(prev => ({
            ...prev,
            appointmentDate: date,
            timeSlot: slot
        }));
        setShowFollowupCalendar(false);
    };

    // Close dropdown when clicking outside (simple implementation using document listener could be added, 
    // but for now, clicking another row or action closes it via logic)
    useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="BODY">
            <div className="appointment">
                <div className="counselor-dashboard-layout">
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm header-bar">
                        <h2 className="mb-0 text-primary">Counsellor Dashboard - {user.person_name}</h2>
                        <div className="btn-group" role="group" aria-label="Appointment Filter">
                            <button
                                type="button"
                                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pending Requests
                            </button>
                            <button
                                type="button"
                                className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('confirmed')}
                            >
                                Upcoming Appointments
                            </button>
                            <button
                                type="button"
                                className={`btn ${filter === 'history' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('history')}
                            >
                                History
                            </button>
                        </div>
                        <button
                            className={`btn ${showCalendar ? 'btn-info text-white' : 'btn-outline-info'} ms-3`}
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            {showCalendar ? 'Hide Monthly Plan' : 'Monthly Plan'}
                        </button>
                    </div>

                    {/* History sub-filters */}
                    {filter === 'history' && (
                        <div className="d-flex align-items-center gap-2 mt-2 mb-0 px-3">
                            <span className="text-muted fw-semibold small">Date Range:</span>
                            <button
                                className={`btn btn-sm ${historyTimeFilter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setHistoryTimeFilter('week')}
                            >
                                Last 7 Days
                            </button>
                            <button
                                className={`btn btn-sm ${historyTimeFilter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setHistoryTimeFilter('month')}
                            >
                                Last 30 Days
                            </button>
                            <button
                                className={`btn btn-sm ${historyTimeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setHistoryTimeFilter('all')}
                            >
                                All History
                            </button>
                        </div>
                    )}

                    <div className="white-board-container">
                        {showCalendar ? (
                            <div className="calendar-view p-3">
                                <h4 className="text-center mb-4 text-primary">Monthly Plan (Next 30 Days)</h4>
                                <div className="table-responsive">
                                    <table className="table table-bordered text-center calendar-table">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Date</th>
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
                                            {Array.from({ length: 30 }).map((_, dayIndex) => {
                                                const date = new Date();
                                                date.setDate(date.getDate() + dayIndex);
                                                const dateString = date.toLocaleDateString();
                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                                                // Slots: 9, 10, 11, 12, 13(Lunch), 14, 15, 16, 17
                                                const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17];

                                                return (
                                                    <tr key={dayIndex}>
                                                        <td className="fw-bold bg-light" style={{ minWidth: '120px' }}>
                                                            {dateString} <br /> <small className="text-muted">{dayName}</small>
                                                            <div className="mt-2 d-flex justify-content-center gap-1">
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={() => openBlockDayConfirm(date)}
                                                                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: '12px' }}
                                                                    title="Block Entire Day"
                                                                >
                                                                    Block
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-info"
                                                                    onClick={() => openUnblockDayConfirm(date)}
                                                                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: '12px' }}
                                                                    title="Unblock Entire Day"
                                                                >
                                                                    Unblock
                                                                </button>
                                                            </div>
                                                        </td>
                                                        {timeSlots.map(hour => {
                                                            if (hour === 13) {
                                                                return <td key={hour} className="bg-secondary text-white align-middle">Lunch Break</td>;
                                                            }

                                                            // Find appointment for this slot
                                                            // Format time logic: "09:00 AM - 10:00 AM" roughly matches our slot
                                                            // DB stores "09:00 AM - 10:00 AM" string
                                                            // Let's construct matching string or check substring
                                                            const hour12 = hour > 12 ? hour - 12 : hour;
                                                            const ampm = hour >= 12 ? 'PM' : 'AM';
                                                            const nextHour = hour + 1;
                                                            const nextHour12 = nextHour > 12 ? nextHour - 12 : nextHour;
                                                            const nextAmpm = nextHour >= 12 ? 'PM' : 'AM';

                                                            const slotStringStart = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
                                                            // Appt timeSlot format: "09:00 AM - 10:00 AM"

                                                            const bookedAppt = calendarAppointments.find(appt => {
                                                                const apptDate = new Date(appt.appointmentDate).toLocaleDateString();
                                                                return apptDate === dateString && appt.timeSlot.startsWith(slotStringStart);
                                                            });

                                                            const isBlocked = bookedAppt && bookedAppt.status === 'blocked';
                                                            const fullSlotString = `${slotStringStart} - ${nextHour12.toString().padStart(2, '0')}:00 ${nextAmpm}`;

                                                            return (
                                                                <td key={hour} className={`align-middle ${isBlocked ? 'bg-secondary text-white clickable-slot' : bookedAppt ? 'bg-success text-white clickable-slot' : 'clickable-slot hover-bg-light'}`}
                                                                    onClick={() => {
                                                                        if (isBlocked) {
                                                                            openUnblockConfirm(date, fullSlotString);
                                                                        } else if (bookedAppt) {
                                                                            openPatientModal(bookedAppt);
                                                                        } else {
                                                                            openBlockConfirm(date, fullSlotString);
                                                                        }
                                                                    }}
                                                                    style={{ cursor: 'pointer', height: '80px' }}
                                                                >
                                                                    {isBlocked ? (
                                                                        <div className="fw-bold">Blocked</div>
                                                                    ) : bookedAppt ? (
                                                                        <div>
                                                                            <strong>{bookedAppt.fullName}</strong>
                                                                            <br />
                                                                            {/* Show Severity Badge Style Text */}
                                                                            <small className="fw-bold" style={{ textTransform: 'capitalize' }}>
                                                                                {bookedAppt.problemExtent || 'Moderate'}
                                                                            </small>
                                                                        </div>
                                                                    ) : '-'}
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
                        ) : loading ? <p className="text-center p-4">Loading...</p> : (
                            <div className="table-responsive">
                                {appointments.length > 0 ? (
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Patient Name</th>
                                                <th>Mobile</th>
                                                <th>Problem</th>
                                                <th>Problem Related</th>
                                                <th>Reference</th>
                                                <th>Status</th>
                                                <th class="text-center">Prior Appts</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments
                                                .filter((appt) => {
                                                    if (filter !== 'history' || historyTimeFilter === 'all') return true;
                                                    // DB stores "2026-01-23 05:30:00+05:30" — replace space with T for reliable parsing
                                                    const dateStr = String(appt.appointmentDate).replace(' ', 'T');
                                                    const raw = new Date(dateStr);
                                                    if (isNaN(raw.getTime())) return true; // safety: show if unparseable
                                                    const apptDate = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
                                                    // Normalize "now" to local midnight
                                                    const now = new Date();
                                                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                                    if (historyTimeFilter === 'week') {
                                                        const cutoff = new Date(today);
                                                        cutoff.setDate(today.getDate() - 7);
                                                        return apptDate >= cutoff;
                                                    }
                                                    if (historyTimeFilter === 'month') {
                                                        const cutoff = new Date(today);
                                                        cutoff.setMonth(today.getMonth() - 1);
                                                        return apptDate >= cutoff;
                                                    }
                                                    return true;
                                                })
                                                .map((appt) => (
                                                    <tr key={appt.id} onClick={() => openPatientModal(appt)} style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: appt.user?.isStarred ? '#fffacd' : 'transparent',
                                                        borderLeft: appt.user?.isStarred ? '4px solid #ffc107' : 'none'
                                                    }}>
                                                        <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                                        <td>{appt.timeSlot}</td>
                                                        <td>
                                                            <span
                                                                onClick={(e) => handleToggleStar(appt.userId, e)}
                                                                style={{ cursor: 'pointer', marginRight: '5px', fontSize: '1.2rem', color: appt.user?.isStarred ? '#ffc107' : '#ccc' }}
                                                                title={appt.user?.isStarred ? "Unstar Patient" : "Star Patient"}
                                                            >
                                                                {appt.user?.isStarred ? '★' : '☆'}
                                                            </span>
                                                            {appt.fullName}
                                                        </td>
                                                        <td>{appt.mobileNumber}</td>
                                                        <td className="long-text-cell">
                                                            <div title={appt.problemDescription}>
                                                                <span className={`severity-badge severity-${(appt.problemExtent || '').toLowerCase()}`}>
                                                                    {appt.problemExtent}
                                                                </span>
                                                                {' - '}{appt.problemDescription}
                                                            </div>
                                                        </td>
                                                        <td>{appt.problemRelatedWith || '-'}</td>
                                                        <td>{appt.modeOfReferral || 'N/A'}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill ${appt.status === 'confirmed' ? 'bg-success' :
                                                                appt.status === 'rejected' ? 'bg-secondary' :
                                                                    appt.status === 'resolved' ? 'bg-info' :
                                                                        appt.status === 'followup' ? 'bg-warning text-dark' :
                                                                            appt.status === 'absent' ? 'bg-danger' :
                                                                                'bg-secondary text-dark'
                                                                }`}>
                                                                {appt.status === 'followup' ? 'Follow-Up' :
                                                                    appt.status === 'resolved' ? 'Resolved' :
                                                                        appt.status === 'absent' ? 'Absent' :
                                                                            appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span
                                                                className={`badge rounded-pill ${(priorCounts[appt.id] || 0) > 0
                                                                    ? 'bg-primary'
                                                                    : 'bg-light text-muted border'
                                                                    }`}
                                                                title="Count of prior resolved/follow-up appointments with this counselor"
                                                            >
                                                                {priorCounts[appt.id] ?? '—'}
                                                            </span>
                                                        </td>
                                                        <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                            {filter === 'pending' ? (
                                                                <div className="btn-group btn-group-sm">
                                                                    <button className="btn btn-action btn-accept" onClick={() => handleStatusUpdate(appt.id, 'confirmed')}>Accept</button>
                                                                    <button className="btn btn-action btn-reject" onClick={(e) => initiateReject(appt, e)}>Reject</button>
                                                                </div>
                                                            ) : (
                                                                <div className="actions-wrapper">
                                                                    <button className="btn btn-sm btn-outline-secondary dropdown-toggle" onClick={(e) => toggleActions(appt.id, e)}>
                                                                        Actions
                                                                    </button>
                                                                    {activeActionId === appt.id && (
                                                                        <div className="actions-dropdown-menu">
                                                                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); openNoteModal(appt); }}>
                                                                                {appt.notes ? 'Edit Notes' : 'Add Notes'}
                                                                            </button>
                                                                            {appt.status !== 'resolved' && (
                                                                                <button className="dropdown-item text-info" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appt.id, 'resolved'); setActiveActionId(null); }}>
                                                                                    Mark as Resolved
                                                                                </button>
                                                                            )}
                                                                            {appt.status !== 'followup' && (
                                                                                <button className="dropdown-item" style={{ color: '#e67e22' }} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appt.id, 'followup'); setActiveActionId(null); }}>
                                                                                    Request Follow-Up
                                                                                </button>
                                                                            )}
                                                                            {appt.status !== 'absent' && (
                                                                                <button className="dropdown-item text-danger" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appt.id, 'absent'); setActiveActionId(null); }}>
                                                                                    Mark as Absent
                                                                                </button>
                                                                            )}
                                                                            {filter !== 'history' && appt.status !== 'rejected' && appt.status !== 'postponed' && (
                                                                                <>
                                                                                    <button className="dropdown-item text-danger" onClick={(e) => initiateReject(appt, e)}>
                                                                                        Reject
                                                                                    </button>
                                                                                    <button className="dropdown-item text-warning" onClick={(e) => initiatePostpone(appt, e)}>
                                                                                        Postpone
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center p-5">
                                        <h4>No {filter} appointments found.</h4>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Note Modal */}
            {selectedAppointment && !showHistoryModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Notes for {selectedAppointment.fullName}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedAppointment(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                <p><strong>Problem:</strong> {selectedAppointment.problemDescription}</p>
                                <div className="mb-3">
                                    <label className="form-label">Session Notes:</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Enter session notes details here..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedAppointment(null)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddNote}>Save Notes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient History Modal */}
            {showHistoryModal && selectedAppointment && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Patient Details & History: {selectedAppointment.fullName}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closePatientModal}></button>
                            </div>
                            <div className="modal-body">
                                {/* Client Profile Photo */}
                                <div className="text-center mb-3">
                                    <img
                                        src={clientProfilePic || `https://ui-avatars.com/api/?background=0d6efd&color=fff&size=128&name=${encodeURIComponent(selectedAppointment.fullName)}`}
                                        alt={selectedAppointment.fullName}
                                        style={{
                                            width: "90px",
                                            height: "90px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "3px solid #0d6efd",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                        }}
                                    />
                                    <div className="mt-1 fw-semibold text-muted">{selectedAppointment.fullName}</div>
                                </div>

                                {/* Current Appointment Details */}
                                <div className="card mb-4 shadow-sm">
                                    <div className="card-header bg-light">
                                        <strong>Current Appointment</strong>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                                <p><strong>Time:</strong> {selectedAppointment.timeSlot}</p>
                                                <p><strong>Status:</strong> <span className={`badge ${selectedAppointment.status === 'confirmed' ? 'bg-success' : selectedAppointment.status === 'rejected' ? 'bg-secondary' : selectedAppointment.status === 'absent' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedAppointment.status}</span></p>
                                                <p><strong>Gender:</strong> {selectedAppointment.gender || <span className="text-muted">Not specified</span>}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Problem:</strong> {selectedAppointment.problemDescription}</p>
                                                <p><strong>Extent:</strong> {selectedAppointment.problemExtent}</p>
                                                <p><strong>Referral:</strong> {selectedAppointment.modeOfReferral}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* History Section */}
                                <h5 className="mb-3 text-secondary border-bottom pb-2">Appointment History</h5>
                                {historyLoading ? (
                                    <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>
                                ) : (
                                    <div className="custom-table-container">
                                        {patientHistory.filter(h => h.id !== selectedAppointment.id).length > 0 ? (
                                            <table className="table table-sm table-striped history-table">
                                                <thead className="table-secondary">
                                                    <tr>
                                                        <th className="cell-min-width-sm">Date</th>
                                                        <th className="cell-min-width-md">Counselor</th>
                                                        <th className="cell-min-width-sm">Status</th>
                                                        <th className="cell-min-width-lg">Problem</th>
                                                        <th className="cell-min-width-md">Problem Related</th>
                                                        <th className="cell-min-width-lg">Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {patientHistory.filter(h => h.id !== selectedAppointment.id).map((hist) => (
                                                        <tr key={hist.id}>
                                                            <td>{new Date(hist.appointmentDate).toLocaleDateString()}</td>
                                                            <td>{hist.counselorName || '-'}</td>
                                                            <td>
                                                                <span className={`badge rounded-pill ${hist.status === 'confirmed' ? 'bg-success' :
                                                                    hist.status === 'rejected' ? 'bg-secondary' :
                                                                        hist.status === 'resolved' ? 'bg-info' :
                                                                            hist.status === 'followup' ? 'bg-warning text-dark' :
                                                                                hist.status === 'absent' ? 'bg-danger' :
                                                                                    'bg-secondary text-dark'
                                                                    }`}>
                                                                    {hist.status === 'followup' ? 'Follow-Up' :
                                                                        hist.status === 'resolved' ? 'Resolved' :
                                                                            hist.status === 'absent' ? 'Absent' :
                                                                                hist.status ? hist.status.charAt(0).toUpperCase() + hist.status.slice(1) : '-'}
                                                                </span>
                                                            </td>
                                                            <td className="long-text-cell">{hist.problemDescription}</td>
                                                            <td>{hist.problemRelatedWith || '-'}</td>
                                                            <td className="long-text-cell"><small>{hist.notes || '-'}</small></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-muted text-center">No previous history found.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer justify-content-between">
                                <div>
                                    {selectedAppointment.status !== 'confirmed' && selectedAppointment.status !== 'resolved' && selectedAppointment.status !== 'followup' && (
                                        <button
                                            type="button"
                                            className="btn btn-success me-2"
                                            onClick={() => { handleStatusUpdate(selectedAppointment.id, 'confirmed'); closePatientModal(); }}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {selectedAppointment.status !== 'resolved' && (
                                        <button
                                            type="button"
                                            className="btn btn-info me-2 text-white"
                                            onClick={() => { handleStatusUpdate(selectedAppointment.id, 'resolved'); closePatientModal(); }}
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    {selectedAppointment.status !== 'followup' && (
                                        <button
                                            type="button"
                                            className="btn me-2"
                                            style={{ background: '#e67e22', color: '#fff' }}
                                            onClick={() => { handleStatusUpdate(selectedAppointment.id, 'followup'); closePatientModal(); }}
                                        >
                                            Request Follow-Up
                                        </button>
                                    )}
                                    {selectedAppointment.status !== 'absent' && selectedAppointment.status !== 'resolved' && (
                                        <button
                                            type="button"
                                            className="btn btn-warning me-2 text-dark"
                                            onClick={() => { handleStatusUpdate(selectedAppointment.id, 'absent'); closePatientModal(); }}
                                        >
                                            Mark Absent
                                        </button>
                                    )}
                                    {selectedAppointment.status !== 'rejected' && selectedAppointment.status !== 'resolved' && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={(e) => initiateReject(selectedAppointment, e)}
                                        >
                                            Reject
                                        </button>
                                    )}
                                    {isAppointmentPast(selectedAppointment) && (
                                        <button
                                            type="button"
                                            className="btn btn-primary ms-2"
                                            onClick={() => initiateFollowupBooking(selectedAppointment)}
                                        >
                                            Book Appointment
                                        </button>
                                    )}
                                </div>
                                <button type="button" className="btn btn-secondary" onClick={closePatientModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            {showRejectConfirm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Confirm Rejection</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={cancelReject}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you really want to reject the appointment for <strong>{appointmentToReject?.fullName}</strong>?</p>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Reason for Rejection <span className="text-danger">*</span>
                                    </label>

                                    <div className="mb-2 d-flex flex-wrap gap-2">
                                        {[
                                            "I am busy due to a prior commitment.",
                                            "I have an urgent meeting to attend.",
                                            "As per the student's request, I am cancelling the appointment.",
                                            "I am on unexpected leave today."
                                        ].map((reason, i) => (
                                            <span
                                                key={i}
                                                className={`badge border rounded-pill ${rejectNote === reason ? 'bg-primary text-white' : 'bg-light text-dark fw-normal'}`}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                onClick={() => setRejectNote(reason)}
                                            >
                                                {reason}
                                            </span>
                                        ))}
                                    </div>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Type a custom reason or select an option above..."
                                        value={rejectNote}
                                        onChange={(e) => setRejectNote(e.target.value)}
                                    />
                                    {!rejectNote.trim() && (
                                        <small className="text-muted">A reason is required before rejecting.</small>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelReject}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmReject}
                                    disabled={!rejectNote.trim()}
                                >
                                    Yes, Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Postpone Confirmation Modal */}
            {showPostponeConfirm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-dark">
                                <h5 className="modal-title">Confirm Postpone</h5>
                                <button type="button" className="btn-close" onClick={cancelPostpone}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you really want to postpone the appointment for <strong>{appointmentToPostpone?.fullName}</strong>?</p>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Reason for Postponement <span className="text-danger">*</span>
                                    </label>

                                    <div className="mb-2 d-flex flex-wrap gap-2">
                                        {[
                                            "I am busy due to a prior commitment.",
                                            "I have an urgent meeting to attend.",
                                            "As per the student's request, I am postponing the appointment.",
                                            "I am on unexpected leave today."
                                        ].map((reason, i) => (
                                            <span
                                                key={i}
                                                className={`badge border rounded-pill ${postponeNote === reason ? 'bg-primary text-white' : 'bg-light text-dark fw-normal'}`}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                onClick={() => setPostponeNote(reason)}
                                            >
                                                {reason}
                                            </span>
                                        ))}
                                    </div>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Type a custom reason or select an option above..."
                                        value={postponeNote}
                                        onChange={(e) => setPostponeNote(e.target.value)}
                                    />
                                    {!postponeNote.trim() && (
                                        <small className="text-muted">A reason is required before postponing.</small>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelPostpone}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-warning text-dark"
                                    onClick={confirmPostpone}
                                    disabled={!postponeNote.trim()}
                                >
                                    Yes, Postpone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {showBlockConfirm && slotToManage && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary text-white">
                                <h5 className="modal-title">Confirm Block Slot</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBlockConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to block the slot on <strong>{slotToManage.appointmentDate.toLocaleDateString()}</strong> at <strong>{slotToManage.timeSlot}</strong>?</p>
                                <p className="text-muted small">This slot will no longer be available for clients to book.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" onClick={() => setShowBlockConfirm(false)}>Cancel</button>
                                <button type="button" className="btn btn-secondary" onClick={confirmBlockSlot}>Yes, Block Slot</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Unblock Confirmation Modal */}
            {showUnblockConfirm && slotToManage && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-dark">
                                <h5 className="modal-title">Confirm Unblock Slot</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUnblockConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to unblock the slot on <strong>{slotToManage.appointmentDate.toLocaleDateString()}</strong> at <strong>{slotToManage.timeSlot}</strong>?</p>
                                <p className="text-muted small">This slot will become available for clients to book again.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUnblockConfirm(false)}>Cancel</button>
                                <button type="button" className="btn btn-info" onClick={confirmUnblockSlot}>Yes, Unblock Slot</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Day Confirmation Modal */}
            {showBlockDayConfirm && dayToManage && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary text-white">
                                <h5 className="modal-title">Confirm Block Day</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBlockDayConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to block the entire day on <strong>{dayToManage.appointmentDate.toLocaleDateString()}</strong>?</p>
                                <p className="text-muted small">All free slots for this day will be blocked. Existing appointments will not be affected.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" onClick={() => setShowBlockDayConfirm(false)}>Cancel</button>
                                <button type="button" className="btn btn-secondary" onClick={confirmBlockDay}>Yes, Block Day</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Unblock Day Confirmation Modal */}
            {showUnblockDayConfirm && dayToManage && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-dark">
                                <h5 className="modal-title">Confirm Unblock Day</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUnblockDayConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to unblock all previously blocked slots on <strong>{dayToManage.appointmentDate.toLocaleDateString()}</strong>?</p>
                                <p className="text-muted small">This will make any blocked slot available for clients to book again.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUnblockDayConfirm(false)}>Cancel</button>
                                <button type="button" className="btn btn-info" onClick={confirmUnblockDay}>Yes, Unblock Day</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Follow-up Booking Modal */}
            {showFollowupForm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1080 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Book Follow-up Appointment</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowFollowupForm(false)}></button>
                            </div>
                            <form onSubmit={handleFollowupSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Client Name</label>
                                            <input type="text" className="form-control bg-light" value={followupData.fullName} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Email</label>
                                            <input type="email" className="form-control bg-light" value={followupData.email} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Mobile Number</label>
                                            <input type="text" className="form-control bg-light" value={followupData.mobileNumber} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Counselor</label>
                                            <input type="text" className="form-control bg-light" value={followupData.counselorName} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Mode of Referral</label>
                                            <input type="text" className="form-control" value={followupData.modeOfReferral} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Problem Related With</label>
                                            <select
                                                className="form-select"
                                                value={followupData.problemRelatedWith}
                                                onChange={(e) => setFollowupData({ ...followupData, problemRelatedWith: e.target.value })}
                                                required
                                            >
                                                <option value="" disabled>Select Problem Area</option>
                                                <option value="Academics">Academics</option>
                                                <option value="Relationship">Relationship</option>
                                                <option value="Family">Family</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Health">Health</option>
                                                <option value="Lifestyle related">Lifestyle related</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Problem Description</label>
                                            <textarea className="form-control" rows="2" value={followupData.problemDescription} onChange={(e) => setFollowupData({ ...followupData, problemDescription: e.target.value })}></textarea>
                                        </div>

                                        <div className="col-12 border-top pt-3">
                                            <h6 className="text-primary mb-3">Select New Slot</h6>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => {
                                                    fetchCounselorAvailability();
                                                    setShowFollowupCalendar(true);
                                                }}
                                            >
                                                {followupData.appointmentDate && followupData.timeSlot
                                                    ? `${new Date(followupData.appointmentDate).toLocaleDateString()} at ${followupData.timeSlot}`
                                                    : "Open Calendar to Select Slot"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowFollowupForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={bookingFollowup}>
                                        {bookingFollowup ? "Booking..." : "Submit Follow-Up"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Follow-up Calendar Modal */}
            {showFollowupCalendar && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Select Time Slot for {user.person_name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowFollowupCalendar(false)}></button>
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
                                                    {Array.from({ length: 30 }).map((_, dayIndex) => {
                                                        const date = new Date();
                                                        date.setDate(date.getDate() + dayIndex);
                                                        const dateString = date.toLocaleDateString();
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
                                                                        return <td key={hour} className="bg-secondary text-white align-middle">Lunch</td>;
                                                                    }

                                                                    const hour12 = hour > 12 ? hour - 12 : hour;
                                                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                                                    const slotString = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;

                                                                    const isToday = isoDate === new Date().toISOString().split('T')[0];
                                                                    const currentHour = new Date().getHours();
                                                                    const isPastSlot = isToday && currentHour >= hour;

                                                                    const isBooked = counselorAvailability.some(appt => {
                                                                        const apptDateObj = new Date(appt.appointmentDate);
                                                                        const apptIsoDate = apptDateObj.toISOString().split('T')[0];
                                                                        return apptIsoDate === isoDate && appt.timeSlot.startsWith(slotString);
                                                                    });

                                                                    return (
                                                                        <td
                                                                            key={hour}
                                                                            className={`align-middle ${isBooked ? 'bg-danger text-white' : isPastSlot ? 'bg-light text-muted opacity-50' : 'clickable-slot'}`}
                                                                            onClick={() => !isBooked && !isPastSlot && handleFollowupSlotSelect(isoDate, `${slotString} - ${hour12 + 1 > 12 ? hour12 + 1 - 12 : hour12 + 1}:00 ${hour + 1 >= 12 ? 'PM' : 'AM'}`)}
                                                                            style={{ cursor: isBooked || isPastSlot ? 'not-allowed' : 'pointer', minWidth: '100px' }}
                                                                        >
                                                                            {isBooked ? "Booked" : isPastSlot ? "Passed" : "Free"}
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

            <ToastContainer />
        </div>
    );
};

export default CounselorDashboard;
