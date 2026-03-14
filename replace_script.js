const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'controllers', 'appointmentController.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `// Block a slot
exports.blockSlot = async (req, res) => {
    try {
        const { counselorName, appointmentDate, timeSlot } = req.body;
        
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Ensure no actual pending/approved/blocked appointment exists
        const existingAppointment = await Appointment.findOne({
            where: {
                counselorName,
                timeSlot,
                status: { [Op.not]: 'rejected' },
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
};`;

const regex = /\/\/ Block a slot\r?\nexports\.blockSlot \= async[\s\S]+?\}\r?\n\};\r?\n/g;
if (regex.test(content)) {
    content = content.replace(regex, replacement + '\n');
    fs.writeFileSync(filePath, content);
    console.log("Successfully replaced blocks!");
} else {
    console.log("Could not match the block!");
}
