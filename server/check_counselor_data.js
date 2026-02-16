const sequelize = require('./db/database');
const User = require('./model/userSchema');
const Role = require('./model/role');
const Counselor = require('./model/counselor');

const check = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const emails = [
            'deepak.phogat@iitrpr.ac.in',
            'Gargi.tiwary@iitrpr.ac.in',
            '2023csb1155@iitrpr.ac.in'
        ];

        console.log('\n--- Checking Users ---');
        const users = await User.findAll({ where: { email: emails } });
        users.forEach(u => console.log(`Found User: ${u.person_name} (${u.email})`));
        if (users.length === 0) console.log('No users found with target emails.');

        console.log('\n--- Checking Roles ---');
        const roles = await Role.findAll({ where: { email: emails } });
        roles.forEach(r => console.log(`Found Role: ${r.email} - ${r.role}`));
        if (roles.length === 0) console.log('No roles found with target emails.');

        console.log('\n--- Checking Counselors ---');
        const counselors = await Counselor.findAll();
        counselors.forEach(c => console.log(`Found Counselor: ${c.name} (${c.email})`));
        if (counselors.length === 0) console.log('No counselors found in table.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

check();
