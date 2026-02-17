require('dotenv').config();
const { Op } = require("sequelize");
const Appointment = require("./model/appointment");
const sequelize = require("./db/database");

async function testAvailability() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const counselorName = "Deepak Phogat";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(`Testing availability for ${counselorName} after ${today}`);

        const appointments = await Appointment.findAll({
            where: {
                counselorName: counselorName,
                status: 'approved',
                appointmentDate: { [Op.gte]: today }
            },
            attributes: ['appointmentDate', 'timeSlot']
        });

        console.log(`Found ${appointments.length} appointments`);
        console.log("Success!");
    } catch (err) {
        console.error("Error fetching availability:", err);
        console.error("Full error object:", JSON.stringify(err, null, 2));
    } finally {
        await sequelize.close();
    }
}

testAvailability();
