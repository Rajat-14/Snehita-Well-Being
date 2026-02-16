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

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // If user checks 'approved', we might also want to see 'completed' ones or just approved
            // For now, let's fetch based on status
            const response = await axios.get(`${BASE_URL}/counselor/appointments`, {
                params: {
                    counselorName: user.person_name,
                    status: filter === 'history' ? undefined : filter // 'history' could fetch all or specific logic
                },
                withCredentials: true,
            });
            // If filter is 'history', maybe client wants to see approved/completed/rejected? 
            // User request said: "my appointment only appointmnets with status accept should show"
            // So let's stick to 'pending' vs 'approved'.

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

    return (
        <div className="BODY">
            <div className="appointment">
                <div className="counselor-view-container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                    <h2 className="text-center mb-4">Counselor Dashboard - {user.person_name}</h2>

                    <div className="d-flex justify-content-center mb-4">
                        <button
                            className={`btn me-2 ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending Requests
                        </button>
                        <button
                            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('approved')}
                        >
                            My Appointments (Approved)
                        </button>
                    </div>

                    {loading ? <p className="text-center">Loading...</p> : (
                        <div className="table-responsive">
                            {appointments.length > 0 ? (
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Patient Name</th>
                                            <th>Mobile</th>
                                            <th>Problem</th>
                                            <th>Reference</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appt) => (
                                            <tr key={appt.id}>
                                                <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                                <td>{appt.timeSlot}</td>
                                                <td>{appt.fullName}</td>
                                                <td>{appt.mobileNumber}</td>
                                                <td>
                                                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={appt.problemDescription}>
                                                        {appt.problemExtent} - {appt.problemDescription}
                                                    </div>
                                                </td>
                                                <td>{appt.modeOfReferral || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${appt.status === 'approved' ? 'bg-success' : appt.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {filter === 'pending' && (
                                                        <>
                                                            <button className="btn btn-sm btn-success me-1" onClick={() => handleStatusUpdate(appt.id, 'approved')}>Accept</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(appt.id, 'rejected')}>Reject</button>
                                                        </>
                                                    )}
                                                    {filter === 'approved' && (
                                                        <button className="btn btn-sm btn-info text-white" onClick={() => openNoteModal(appt)}>
                                                            {appt.notes ? 'Edit Notes' : 'Add Notes'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center p-5 bg-light rounded">
                                    <h4>No {filter} appointments found.</h4>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Note Modal */}
            {selectedAppointment && (
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

            <ToastContainer />
        </div>
    );
};

export default CounselorDashboard;
