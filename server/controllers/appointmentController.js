const Appointment = require("../model/appointment");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");

exports.createAppointment = async (req, res) => {
    try {
        const token = req.cookies.usertoken;
        console.log("Token received:", token);
        const decoded = jwt.verify(token, "abcdef");
        const userId = decoded.id;
        const {
            fullName,
            mobileNumber,
            emailAddress,
            appointmentDate,
            counselorName,
            appointmentSlot,
        } = req.body;

        const appointment = await Appointment.create({
            fullName,
            mobileNumber,
            emailAddress,
            appointmentDate,
            counselorName,
            appointmentSlot,
            userId,
        });

        res.status(201).json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const token = req.cookies.usertoken;
        console.log("Token received:", token);
        const decoded = jwt.verify(token, "abcdef");
        const userId = decoded.id;
        console.log(userId);
        const appointments = await Appointment.findAll({ where: { userId: userId } });
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getBookedSlots = async (req, res) => {
    try {
        const { counselorName, appointmentDate } = req.query;
        // Sequelize query handling Date might need exact match or range. 
        // Assuming the frontend sends a date string that matches the DB format or we cast it.
        const appointments = await Appointment.findAll({
            where: {
                counselorName: counselorName,
                appointmentDate: new Date(appointmentDate),
            }
        });
        const bookedSlots = appointments.map(
            (appointment) => appointment.appointmentSlot
        );
        res.json(bookedSlots);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.sendEmail = async (req, res) => {
    const formData = req.body;

    // Map counselor names to their email addresses
    const counselorEmails = {
        "Deepak Phogat": "2021csb1123@iitrpr.ac.in",
        "Gargi Tiwari": "kumarchspiyush@gmail.com",
    };

    // Get the email address of the chosen counselor
    const counselorEmail = counselorEmails[formData.counselorName];

    let formattedText = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="background-color: #f2f2f2; padding: 10px; text-align: center;">Appointment Confirmation</h1>
    <p>Hello ${formData.counselorName},</p>
    <p>The following individual has scheduled an appointment with you. Please find the details below:</p>
    <ul>
`;

    for (let key in formData) {
        if (key !== "counselorName") {
            formattedText += `<li><strong>${key}:</strong> ${formData[key]}</li>`;
        }
    }

    formattedText += `
    </ul>
    <p>Regards,</p>
    <p><strong>Team Snehita Well-Being</strong></p>
  </div>
`;

    let info = await transporter.sendMail({
        from: '"Piyush" pushkr.1090@gmail.com', // sender address
        to: counselorEmail, // send to the chosen counselor
        subject: "New Counselling Appointment", // Subject line
        html: formattedText, // formatted text body
    });
    res.json({ message: "Email sent" });
};
