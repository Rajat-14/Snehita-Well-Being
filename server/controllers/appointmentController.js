const Appointment = require("../model/appointment");
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const { Op } = require("sequelize");

exports.createAppointment = async (req, res) => {
    try {
        console.log("====================================");
        console.log("REQUEST BODY RECEIVED:", req.body);
        console.log("====================================");

        const token = req.cookies.usertoken;
        const decoded = jwt.verify(token, "abcdef");
        const userId = decoded.id;

        const {
            fullName,
            mobileNumber,
            email,
            age,
            gender,
            problemDescription,
            problemExtent,
            problemRelatedWith,
            modeOfReferral,
            appointmentDate,
            timeSlot,
            counselorName
        } = req.body;

        console.log("Extracted Values:");
        console.log({
            fullName,
            mobileNumber,
            email,
            age,
            gender,
            problemDescription,
            problemExtent,
            problemRelatedWith,
            modeOfReferral
        });

        // Check for double booking
        const existingAppointment = await Appointment.findOne({
            where: {
                counselorName,
                appointmentDate,
                timeSlot,
                status: { [Op.notIn]: ['rejected', 'postponed'] } // Only non-rejected/postponed appointments count as a conflict
            }
        });

        if (existingAppointment) {
            return res.status(409).json({ error: "Time slot already booked. Please choose another date and time." });
        }

        const appointment = await Appointment.create({
            fullName,
            mobileNumber,
            email,
            age,
            gender,
            problemDescription,
            problemExtent,
            problemRelatedWith,
            modeOfReferral,
            appointmentDate,
            timeSlot,
            counselorName,
            status: "pending",
            userId,
        });

        console.log("INSERTED INTO DATABASE:", appointment.toJSON());

        // Send email notification asynchronously
        sendAppointmentEmail(req.body).catch(err => console.error("Async email send failed:", err));

        res.status(201).json(appointment);
    } catch (err) {
        console.error("Error creating appointment:", err);
        res.status(500).send("Server Error");
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const token = req.cookies.usertoken;
        const decoded = jwt.verify(token, "abcdef");
        const userId = decoded.id;

        // Fetch appointments for the logged-in client
        const appointments = await Appointment.findAll({
            where: { userId: userId },
            order: [['appointmentDate', 'DESC']]
        });
        res.json(appointments);
    } catch (err) {
        console.error("Error fetching client appointments:", err);
        res.status(500).send("Server Error");
    }
};

exports.getBookedSlots = async (req, res) => {
    try {
        const { counselorName, appointmentDate } = req.query;
        // Find all non-rejected appointments for this slot
        const appointments = await Appointment.findAll({
            where: {
                counselorName: counselorName,
                appointmentDate: new Date(appointmentDate),
                status: { [Op.notIn]: ['rejected', 'postponed'] } // Rejected/postponed slots are free again
            }
        });
        const bookedSlots = appointments.map(
            (appointment) => appointment.timeSlot
        );
        res.json(bookedSlots);
    } catch (err) {
        console.error("Error fetching booked slots:", err);
        res.status(500).send("Server Error");
    }
};

const Counselor = require("../model/counselor"); // Import Counselor model

// Helper function to send email
const sendAppointmentEmail = async (formData) => {
    try {
        // Fetch counselor email from the database
        const counselor = await Counselor.findOne({ where: { name: formData.counselorName } });

        if (!counselor || !counselor.email) {
            console.error(`Counselor not found or email missing for: ${formData.counselorName}`);
            return { success: false, message: "Counselor email not found" };
        }

        const counselorEmail = counselor.email;

        let formattedText = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="background-color: #f2f2f2; padding: 10px; text-align: center;">Appointment Request</h1>
    <p>Hello ${formData.counselorName},</p>
    <p>You have a new appointment request. Please log in to your dashboard to review it.</p>
    <ul>
`;
        // Add relevant fields to email
        const fields = ['fullName', 'appointmentDate', 'timeSlot', 'problemDescription'];
        for (let key of fields) {
            if (formData[key]) {
                formattedText += `<li><strong>${key}:</strong> ${formData[key]}</li>`;
            }
        }

        formattedText += `
    </ul>
    <p>Regards,</p>
    <p><strong>Team Snehita Well-Being</strong></p>
  </div>
`;

        await transporter.sendMail({
            from: '"Snehita Appointment" <no-reply@snehita.com>',
            to: counselorEmail,
            subject: "New Counselling Appointment Request",
            html: formattedText,
        });
        console.log(`Email sent successfully to ${counselorEmail}`);
        return { success: true, message: "Email sent" };
    } catch (err) {
        console.error("Error in sendAppointmentEmail:", err);
        return { success: false, message: "Failed to send email" };
    }
};

exports.sendEmail = async (req, res) => {
    const result = await sendAppointmentEmail(req.body);
    if (result.success) {
        res.json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
};

exports.getCounselorAppointments = async (req, res) => {
    try {
        const { counselorName, status, timeframe } = req.query;

        console.log("STATUS RECEIVED:", status);

        let whereClause = { counselorName };


        if (status) {
            let statusArray;

            if (Array.isArray(status)) {
                statusArray = status;
            } else if (typeof status === 'object') {
                // Handles axios sending {0: 'confirmed', 1: 'resolved', ...}
                statusArray = Object.values(status);
            } else if (typeof status === 'string' && status.includes(',')) {
                statusArray = status.split(',');
            } else {
                statusArray = [status];
            }

            whereClause.status = { [Op.in]: statusArray };
        }

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (timeframe === 'future') {
            whereClause.appointmentDate = { [Op.gte]: todayDate };
        } else if (timeframe === 'past') {
            whereClause.appointmentDate = { [Op.lte]: todayDate };
        }

        let appointments = await Appointment.findAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['isStarred']
            }],
            order: [['appointmentDate', timeframe === 'past' ? 'DESC' : 'ASC']]
        });

        if (timeframe === 'future' || timeframe === 'past') {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMins = now.getMinutes();

            appointments = appointments.filter(appt => {
                const apptDate = new Date(appt.appointmentDate);
                apptDate.setHours(0, 0, 0, 0);

                if (apptDate.getTime() !== todayDate.getTime()) {
                    if (timeframe === 'future') return apptDate > todayDate;
                    if (timeframe === 'past') return apptDate < todayDate;
                    return true;
                }

                // Parse end time of timeSlot (e.g. "09:00 AM - 10:00 AM")
                let endTimeStr = appt.timeSlot.split('-')[1];
                if (!endTimeStr) return true; // fail-safe

                endTimeStr = endTimeStr.trim();
                let [time, modifier] = endTimeStr.split(' ');
                if (!time || !modifier) return true; // fail-safe

                let [hours, minutes] = time.split(':');
                hours = parseInt(hours, 10);
                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;

                const isPast = (currentHour > hours) || (currentHour === hours && currentMins >= parseInt(minutes || 0, 10));

                if (timeframe === 'future') return !isPast;
                if (timeframe === 'past') return isPast;
                return true;
            });
        }

        res.json(appointments);
    } catch (err) {
        console.error("Error fetching counselor appointments:", err);
        res.status(500).send("Server Error");
    }
};

exports.getAnalyticsData = async (req, res) => {
    try {
        const { counselorName } = req.query;

        console.log("Fetching analytics for counselor:", counselorName);

        if (!counselorName) {
            return res.status(400).json({ error: "counselorName is required" });
        }

        const appointments = await Appointment.findAll({
            where: {
                counselorName: counselorName,
                status: {
                    [Op.in]: ['confirmed', 'resolved', 'completed', 'followup', 'pending']
                }
            },
            attributes: ['appointmentDate', 'gender', 'problemExtent', 'problemRelatedWith', 'status', 'age', 'modeOfReferral']
        });

        res.json(appointments);
    } catch (err) {
        console.error("Error fetching counselor analytics:", err);
        res.status(500).send("Server Error");
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        console.log("UPDATE STATUS REQUEST RECEIVED:", { id: req.params.id, body: req.body });

        const { id } = req.params;
        const { status, rejectionNote } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        // ❌ Only block FUTURE dates
        if (
            (status === 'followup' || status === 'resolved' || status === 'absent') &&
            appointmentDate > today
        ) {
            return res.status(400).json({
                error: "You can only mark an appointment as follow-up or resolved after the appointment date."
            });
        }
        // ─────────────────────────────────────────────────────────────────────

        // ✅ Update status
        appointment.status = status;

        if ((status === 'rejected' || status === 'postponed') && rejectionNote !== undefined) {
            appointment.rejectionNote = rejectionNote;
        }

        await appointment.save();

        // ─── Postpone email ───────────────────────────────────────────────
        if (status === 'postponed' && appointment.email) {
            const mailOptions = {
                from: process.env.MAIL,
                to: appointment.email,
                subject: "Appointment Postponed: Snehita Well-Being",
                html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #e67e22;">Appointment Postponed</h2>
        <p>Dear ${appointment.fullName},</p>
        <p>Your counselor <strong>${appointment.counselorName}</strong> has postponed your scheduled appointment.</p>
        
        <div style="background:#fff8f0; border-left: 4px solid #e67e22; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <p><strong>Reason:</strong> ${rejectionNote || 'No reason provided.'}</p>
        </div>

        <p>Please log in to your dashboard to choose a new time slot from the counselor's available schedule.</p>
        <p>If you need any assistance, we are here to help.</p>

        <hr />
        <p>Warm regards,<br/>Team Snehita Well-Being</p>
    </div>
`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Error sending postpone email:", error);
                else console.log("Postpone email sent to:", appointment.email);
            });
        }

        // ─── Rejection email ───────────────────────────────────────────────
        if (status === 'rejected' && appointment.email) {
            const mailOptions = {
                from: process.env.MAIL,
                to: appointment.email,
                subject: "Appointment Update: Snehita Well-Being",
                html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #6c757d;">Appointment Update</h2>
        <p>Dear ${appointment.fullName},</p>
        <p>We wanted to inform you that your requested appointment could not be scheduled at this time.</p>
        
        <ul>
            <li><strong>Counselor:</strong> ${appointment.counselorName}</li>
            <li><strong>Requested Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
            <li><strong>Time Slot:</strong> ${appointment.timeSlot}</li>
            ${rejectionNote ? `<li><strong>Note:</strong> ${rejectionNote}</li>` : ''}
        </ul>

        <p>You are encouraged to log in and choose another available time slot that works best for you.</p>
        <p>If you need any assistance, we are here to help.</p>

        <hr />
        <p>Warm regards,<br/>Team Snehita Well-Being</p>
    </div>
`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Error sending rejection email:", error);
                else console.log("Rejection email sent to:", appointment.email);
            });
        }

        // ─── Follow-up email ───────────────────────────────────────────────
        if (status === 'followup' && appointment.email) {
            const mailOptions = {
                from: process.env.MAIL,
                to: appointment.email,
                subject: "Follow-Up Session Recommended – Snehita Well-Being",
                html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #e67e22;">Follow-Up Session Recommended</h2>
        <p>Dear ${appointment.fullName},</p>
        <p>Your counselor <strong>${appointment.counselorName}</strong> has recommended a follow-up session based on your recent appointment.</p>

        <div style="background:#fff8f0; border-left: 4px solid #e67e22; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <p style="margin:0;"><strong>Previous Appointment:</strong></p>
            <ul style="margin: 8px 0 0;">
                <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
                <li><strong>Time Slot:</strong> ${appointment.timeSlot}</li>
                <li><strong>Counselor:</strong> ${appointment.counselorName}</li>
            </ul>
        </div>

        <p>Please log in to the portal and choose a new time slot at your convenience.</p>
        <p>If you have any questions, feel free to reach out to us.</p>

        <hr />
        <p>Warm regards,<br/>Team Snehita Well-Being</p>
    </div>
`
            };
            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Error sending follow-up email:", error);
                else console.log("Follow-up email sent to:", appointment.email);
            });
        }

        // ─── Confirmation Email (for Accept) ──────────────────────────────
        if (status === 'confirmed' && appointment.email) {
            const mailOptions = {
                from: process.env.MAIL,
                to: appointment.email,
                subject: "Appointment Confirmed: Snehita Well-Being",
                html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #27ae60;">Appointment Confirmed</h2>
        <p>Dear ${appointment.fullName},</p>
        <p>Your appointment request has been <strong>confirmed</strong>. We look forward to seeing you.</p>

        <div style="background:#f1f8e9; border-left: 4px solid #27ae60; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <p style="margin:0;"><strong>Appointment Details:</strong></p>
            <ul style="margin: 8px 0 0;">
                <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
                <li><strong>Time Slot:</strong> ${appointment.timeSlot}</li>
                <li><strong>Counselor:</strong> ${appointment.counselorName}</li>
            </ul>
        </div>

        <p>If you need to reschedule or have any questions, please contact us.</p>

        <hr />
        <p>Warm regards,<br/>Team Snehita Well-Being</p>
    </div>
`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Error sending confirmation email:", error);
                else console.log("Confirmation email sent to:", appointment.email);
            });
        }

        res.json(appointment);
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).send("Server Error");
    }
};

// Add/Update Notes
exports.updateAppointmentNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        appointment.notes = notes;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error("Error updating notes:", err);
        res.status(500).send("Server Error");
    }
};


exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (err) {
        console.error("Error fetching appointment:", err);
        res.status(500).send("Server Error");
    }
};

exports.getPriorAppointmentCount = async (req, res) => {
    try {
        const { userId, counselorName, appointmentDate } = req.query;

        if (!appointmentDate) {
            return res.status(400).json({ error: "appointmentDate is required" });
        }

        const givenDate = new Date(appointmentDate);

        const count = await Appointment.count({
            where: {
                userId,
                counselorName,
                status: { [Op.in]: ['resolved', 'followup'] },
                appointmentDate: {
                    [Op.lt]: givenDate // ✅ Only appointments BEFORE this date
                }
            }
        });

        res.json({ count });

    } catch (err) {
        console.error("Error fetching prior appointment count:", err);
        res.status(500).send("Server Error");
    }
};

exports.getPatientHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const history = await Appointment.findAll({
            where: {
                userId: userId,
                status: {
                    [Op.in]: ['confirmed', 'resolved', 'followup', 'absent']
                },
                appointmentDate: { [Op.lt]: today }
            },
            order: [['appointmentDate', 'DESC']],
            attributes: ['id', 'appointmentDate', 'problemDescription', 'notes', 'problemRelatedWith', 'counselorName', 'status'] // Removed status and timeSlot
        });

        res.json(history);
    } catch (err) {
        console.error("Error fetching patient history:", err);
        res.status(500).send("Server Error");
    }
};

exports.getPublicCounselorAvailability = async (req, res) => {
    try {
        const { counselorName } = req.query;
        console.log("Fetching public availability for counselor:", counselorName);

        if (!counselorName) {
            console.warn("Counselor name missing in request");
            return res.status(400).json({ msg: "Counselor name is required" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log("Querying appointments from:", today);

        // Verify that Appointment model is working
        if (!Appointment || !Appointment.findAll) {
            throw new Error("Appointment model is not properly initialized");
        }

        const appointments = await Appointment.findAll({
            where: {
                counselorName: counselorName,
                status: { [Op.notIn]: ['rejected', 'postponed'] }, // Include pending and confirmed
                appointmentDate: { [Op.gte]: today }
            },
            attributes: ['appointmentDate', 'timeSlot']
        });

        console.log(`Found ${appointments.length} appointments for ${counselorName}`);
        res.json(appointments);
    } catch (err) {
        console.error("Error fetching counselor availability:", err);
        // Send detailed error to client for debugging
        res.status(500).json({
            msg: "Server Error fetching availability",
            error: err.message,
            stack: err.stack,
            details: err.toString()
        });
    }
};

// Block a slot
exports.blockSlot = async (req, res) => {
    try {
        const { counselorName, appointmentDate, timeSlot } = req.body;

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Ensure no actual pending/confirmed/blocked appointment exists
        const existingAppointment = await Appointment.findOne({
            where: {
                counselorName,
                timeSlot,
                status: { [Op.notIn]: ['rejected', 'postponed'] },
                appointmentDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        if (existingAppointment) {
            return res.status(409).json({ error: "Time slot already booked or blocked." });
        }

        // Create a dummy appointment with 'blocked' status
        const blockedSlot = await Appointment.create({
            fullName: 'Blocked Slot',
            mobileNumber: 0, // Using 0 for dummy blocked slot
            email: 'system@snehita.com', // Dummy email
            appointmentDate: startOfDay,
            timeSlot,
            counselorName,
            status: "blocked",
        });

        res.status(201).json(blockedSlot);
    } catch (err) {
        console.error("Error blocking slot:", err);
        res.status(500).send("Server Error");
    }
};

// Unblock a slot
exports.unblockSlot = async (req, res) => {
    try {
        const { counselorName, appointmentDate, timeSlot } = req.body;

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const blockedSlot = await Appointment.findOne({
            where: {
                counselorName,
                timeSlot,
                status: 'blocked',
                appointmentDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        if (!blockedSlot) {
            return res.status(404).json({ error: "Blocked slot not found" });
        }

        await blockedSlot.destroy(); // Remove the blocked dummy appointment
        res.json({ message: "Slot unblocked successfully" });
    } catch (err) {
        console.error("Error unblocking slot:", err);
        res.status(500).send("Server Error");
    }
};

// Block an entire day
exports.blockDay = async (req, res) => {
    try {
        const { counselorName, appointmentDate } = req.body;

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Standard 9 hour slots
        const timeSlots = [
            "09:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "12:00 PM - 01:00 PM",
            // 1 PM to 2 PM is lunch break
            "02:00 PM - 03:00 PM",
            "03:00 PM - 04:00 PM",
            "04:00 PM - 05:00 PM",
            "05:00 PM - 06:00 PM"
        ];

        // Find all non-rejected appointments for this day
        const existingAppointments = await Appointment.findAll({
            where: {
                counselorName,
                status: { [Op.notIn]: ['rejected', 'postponed'] },
                appointmentDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        // Set of already taken slots
        const takenSlots = new Set(existingAppointments.map(appt => appt.timeSlot));

        // Create 'blocked' appointments for all free slots
        const slotsToBlock = timeSlots.filter(slot => !takenSlots.has(slot));

        if (slotsToBlock.length === 0) {
            return res.status(409).json({ error: "No free slots to block on this day." });
        }

        const blockPromises = slotsToBlock.map(timeSlot => {
            return Appointment.create({
                fullName: 'Blocked Slot',
                mobileNumber: 0,
                email: 'system@snehita.com',
                appointmentDate: startOfDay,
                timeSlot,
                counselorName,
                status: "blocked",
            });
        });

        await Promise.all(blockPromises);

        res.status(201).json({ message: "Successfully blocked the day", blockedCount: slotsToBlock.length });
    } catch (err) {
        console.error("Error blocking day:", err);
        res.status(500).send("Server Error");
    }
};

// Unblock an entire day
exports.unblockDay = async (req, res) => {
    try {
        const { counselorName, appointmentDate } = req.body;

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find and destroy all 'blocked' slots for this day
        const deletedCount = await Appointment.destroy({
            where: {
                counselorName,
                status: 'blocked',
                appointmentDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        res.json({ message: "Day unblocked successfully", unblockedCount: deletedCount });
    } catch (err) {
        console.error("Error unblocking day:", err);
        res.status(500).send("Server Error");
    }
};

exports.requestCancellationEmail = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { reason } = req.body;

        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        const Counselor = require("../model/counselor");
        const counselor = await Counselor.findOne({ where: { name: appointment.counselorName } });

        if (!counselor || !counselor.email) {
            console.error(`Counselor not found or email missing for: ${appointment.counselorName}`);
            return res.status(404).json({ error: "Counselor email not found" });
        }

        const formattedHtml = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="background-color: #fce4e4; color: #cc0000; padding: 10px; text-align: center;">Appointment Cancellation Request</h1>
                <p>Hello Dr. ${appointment.counselorName},</p>
                <p>A client has requested to cancel their upcoming appointment. Please review the details below:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Patient Name:</strong> ${appointment.fullName}</li>
                        <li><strong>Contact:</strong> ${appointment.mobileNumber} / ${appointment.email}</li>
                        <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
                        <li><strong>Time Slot:</strong> ${appointment.timeSlot}</li>
                    </ul>
                </div>
                <h3>Cancellation Reason:</h3>
                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; font-style: italic; color: #555;">
                    ${reason || "No reason provided."}
                </blockquote>
                <p>If you approve this cancellation, please log in to your dashboard and manually "Reject" the appointment to notify the client and free up the time slot.</p>
                <p>Regards,</p>
                <p><strong>Team Snehita Well-Being</strong></p>
            </div>
        `;

        await transporter.sendMail({
            from: '"Snehita Appointment Alerts" <no-reply@snehita.com>',
            to: counselor.email,
            subject: `Cancellation Request: ${appointment.fullName} - ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
            html: formattedHtml,
        });

        res.json({ message: "Cancellation request sent successfully." });
    } catch (err) {
        console.error("Error sending cancellation request:", err);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointmentDate, timeSlot } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointment = await Appointment.findOne({
            where: {
                counselorName: appointment.counselorName,
                timeSlot,
                status: { [Op.notIn]: ['rejected', 'postponed'] },
                appointmentDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        if (existingAppointment) {
            return res.status(409).json({ error: "Time slot already booked or blocked." });
        }

        appointment.appointmentDate = appointmentDate;
        appointment.timeSlot = timeSlot;
        appointment.status = 'pending';
        appointment.rejectionNote = null; // Clear the postpone reason
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error("Error rescheduling:", err);
        res.status(500).send("Server Error");
    }
};
