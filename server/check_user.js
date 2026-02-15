require('dotenv').config();

// Patch DATABASE_URL to use localhost before loading database.js
if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('host.docker.internal', 'localhost');
}

const sequelize = require('./db/database');
const User = require('./model/userSchema');
const Role = require('./model/role');
const Counselor = require('./model/counselor');
const bcrypt = require('bcrypt');

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const email = '2023csb1171+coun01@iitrpr.ac.in';

        console.log(`Checking for user with email: ${email}`);

        const user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log('User found in User table:');
            console.log(user.toJSON());

            // Check password
            const isMatch = await bcrypt.compare('1234', user.password);
            console.log(`Password '1234' match: ${isMatch}`);
        } else {
            console.log('User NOT found in User table.');
        }

        const role = await Role.findOne({ where: { email: email } });
        if (role) {
            console.log('Role found in Role table:');
            console.log(role.toJSON());
        } else {
            console.log('Role NOT found in Role table.');
        }

        const counselor = await Counselor.findOne({ where: { email: email } });
        if (counselor) {
            console.log('Counselor found in Counselor table:');
            console.log(counselor.toJSON());
        } else {
            console.log('Counselor NOT found in Counselor table.');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkUser();
