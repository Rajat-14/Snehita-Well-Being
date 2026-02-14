const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./db/database');
const Testimonial = require('./model/testimonial');

const checkData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const count = await Testimonial.count();
        console.log(`Number of testimonials in DB: ${count}`);

        if (count > 0) {
            const first = await Testimonial.findOne();
            console.log('First testimonial:', JSON.stringify(first, null, 2));
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkData();
