import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import "./appointment.css";

const CounselorDashboard = ({ user }) => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('pending'); // 'pending' or 'approved'
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [activeActionId, setActiveActionId] = useState(null); // ID of appointment with open actions dropdown
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [appointmentToReject, setAppointmentToReject] = useState(null);

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
        if (appt.userId) {
            fetchPatientHistory(appt.userId);
        }
    };

    const closePatientModal = () => {
        setShowHistoryModal(false);
        // setSelectedAppointment(null); // Keep selected for smoother transition or clear? Let's keep it to avoid flicker if re-opened. 
        // Actually clearing it is safer to reset state.
        setSelectedAppointment(null);
        setPatientHistory([]);
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // If user checks 'approved', we might also want to see 'completed' ones or just approved
            // For now, let's fetch based on status
            let params = {
                counselorName: user.person_name,
                status: filter === 'history' ? 'approved' : filter
            };

            if (filter === 'approved') {
                params.timeframe = 'future';
            } else if (filter === 'history') {
                params.timeframe = 'past';
            }
            // 'pending' doesn't need timeframe, usually we want to see all pending requests regardless of date

            const response = await axios.get(`${BASE_URL}/counselor/appointments`, {
                params: params,
                withCredentials: true,
            });

            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/status/${id}`, { status: newStatus }, { withCredentials: true });
            toast.success(`Appointment ${newStatus}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
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
            await handleStatusUpdate(appointmentToReject.id, 'rejected');
            setShowRejectConfirm(false);
            setAppointmentToReject(null);
        }
    };

    const cancelReject = () => {
        setShowRejectConfirm(false);
        setAppointmentToReject(null);
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
                        <h2 className="mb-0 text-primary">Counselor Dashboard - {user.person_name}</h2>
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
                                className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('approved')}
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
                    </div>

                    <div className="white-board-container">
                        {loading ? <p className="text-center p-4">Loading...</p> : (
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appt) => (
                                                <tr key={appt.id} onClick={() => openPatientModal(appt)} style={{ cursor: 'pointer' }}>
                                                    <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                                    <td>{appt.timeSlot}</td>
                                                    <td>{appt.fullName}</td>
                                                    <td>{appt.mobileNumber}</td>
                                                    <td>
                                                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={appt.problemDescription}>
                                                            <span className={`severity-badge severity-${(appt.problemExtent || '').toLowerCase()}`}>
                                                                {appt.problemExtent}
                                                            </span>
                                                            {' - '}{appt.problemDescription}
                                                        </div>
                                                    </td>
                                                    <td>{appt.problemRelatedWith || '-'}</td>
                                                    <td>{appt.modeOfReferral || 'N/A'}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${appt.status === 'approved' ? 'bg-success' :
                                                            appt.status === 'rejected' ? 'bg-danger' :
                                                                'bg-warning text-dark'
                                                            }`}>
                                                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                        {filter === 'pending' ? (
                                                            <div className="btn-group btn-group-sm">
                                                                <button className="btn btn-action btn-accept" onClick={() => handleStatusUpdate(appt.id, 'approved')}>Accept</button>
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
                                                                        {filter !== 'history' && (
                                                                            <button className="dropdown-item text-danger" onClick={(e) => initiateReject(appt, e)}>
                                                                                Reject
                                                                            </button>
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
                                                <p><strong>Status:</strong> <span className={`badge ${selectedAppointment.status === 'approved' ? 'bg-success' : selectedAppointment.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedAppointment.status}</span></p>
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
                                    <div className="table-responsive">
                                        {patientHistory.filter(h => h.id !== selectedAppointment.id).length > 0 ? (
                                            <table className="table table-sm table-striped">
                                                <thead className="table-secondary">
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Problem</th>
                                                        <th>Problem Related</th>
                                                        {/* <th>Status</th> Removed */}
                                                        <th>Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {patientHistory.filter(h => h.id !== selectedAppointment.id).map((hist) => (
                                                        <tr key={hist.id}>
                                                            <td>{new Date(hist.appointmentDate).toLocaleDateString()}</td>
                                                            <td>{hist.problemDescription}</td>
                                                            <td>{hist.problemRelatedWith || '-'}</td>
                                                            {/* Status removed as per request */}
                                                            <td><small>{hist.notes || '-'}</small></td>
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
                                    {selectedAppointment.status !== 'approved' && (
                                        <button
                                            type="button"
                                            className="btn btn-success me-2"
                                            onClick={() => {
                                                handleStatusUpdate(selectedAppointment.id, 'approved');
                                                closePatientModal();
                                            }}
                                        >
                                            Approve Appointment
                                        </button>
                                    )}
                                    {selectedAppointment.status !== 'rejected' && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleStatusUpdate(selectedAppointment.id, 'rejected');
                                                closePatientModal();
                                            }}
                                        >
                                            Reject Appointment
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
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Confirm Rejection</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={cancelReject}></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you really want to reject the appointment for <strong>{appointmentToReject?.fullName}</strong>?</p>
                                <p className="text-muted small">This action cannot be undone immediately (unless re-requested).</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelReject}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmReject}>Yes, Reject</button>
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
