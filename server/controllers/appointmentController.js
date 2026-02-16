const Appointment = require("../model/appointment");
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
            counselorName,
            durationPeriod
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
            modeOfReferral,
            durationPeriod
        });

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
            durationPeriod,
            status: "pending",
            userId,
        });

        console.log("INSERTED INTO DATABASE:", appointment.toJSON());

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
                status: { [Op.not]: 'rejected' } // Rejected slots are free again
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

exports.sendEmail = async (req, res) => {
    const formData = req.body;

    // Map counselor names to their email addresses - TODO: Move to DB or Config
    const counselorEmails = {
        "Deepak Phogat": "deepak.phogat@iitrpr.ac.in",
        "Gargi Tiwari": "Gargi.tiwary@iitrpr.ac.in",
    };

    const counselorEmail = counselorEmails[formData.counselorName];
    // Fallback if email not found?
    if (!counselorEmail) {
        return res.status(400).json({ message: "Counselor email not found" });
    }

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

    try {
        let info = await transporter.sendMail({
            from: '"Snehita Appointment" <no-reply@snehita.com>',
            to: counselorEmail,
            subject: "New Counselling Appointment Request",
            html: formattedText,
        });
        res.json({ message: "Email sent" });
    } catch (emailErr) {
        console.error("Email error:", emailErr);
        res.status(500).json({ message: "Failed to send email" });
    }
};

exports.getCounselorAppointments = async (req, res) => {
    try {
        const { counselorName, status } = req.query;

        let whereClause = { counselorName };
        if (status) {
            whereClause.status = status;
        }

        const appointments = await Appointment.findAll({
            where: whereClause,
            order: [['appointmentDate', 'ASC']]
        });

        res.json(appointments);
    } catch (err) {
        console.error("Error fetching counselor appointments:", err);
        res.status(500).send("Server Error");
    }
};

// Update status (Approve/Reject)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        appointment.status = status;
        await appointment.save();

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
