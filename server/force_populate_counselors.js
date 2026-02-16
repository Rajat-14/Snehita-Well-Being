const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Define models directly to avoid circular dependency issues during this script run
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
});

const User = sequelize.define('User', {
    person_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

const Role = sequelize.define('Role', {
    email: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    role: { type: DataTypes.ENUM('client', 'counselor', 'admin'), defaultValue: 'client', allowNull: false }
}, { timestamps: true });

const Counselor = sequelize.define('Counselor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

// Setup associations artificially just for this script context if needed, 
// strictly speaking we just need to insert rows in order.

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('--- Database Connected ---');

        // Sync models to ensure tables exist
        // await sequelize.sync(); 
        // NOTE: syncing might be dangerous if models differ from DB slightly. 
        // We assume tables exist.

        const targets = [
            { name: "Deepak Phogat", email: "deepak.phogat@iitrpr.ac.in" },
            { name: "Gargi Tiwary", email: "Gargi.tiwary@iitrpr.ac.in" }
        ];

        for (const t of targets) {
            console.log(`\nProcessing: ${t.name}`);

            // 1. Ensure User
            let user = await User.findOne({ where: { email: t.email } });
            if (!user) {
                console.log('  Creating User...');
                await User.create({
                    person_name: t.name,
                    email: t.email,
                    password: 'password123' // Dummy password
                });
            } else {
                console.log('  User exists.');
            }

            // 2. Ensure Role
            let role = await Role.findOne({ where: { email: t.email } });
            if (!role) {
                console.log('  Creating Role...');
                await Role.create({
                    email: t.email,
                    role: 'counselor'
                });
            } else {
                console.log(`  Role exists (${role.role}).`);
                if (role.role !== 'counselor') {
                    console.log('  Updating Role to counselor...');
                    await role.update({ role: 'counselor' });
                }
            }

            // 3. Ensure Counselor
            let counselor = await Counselor.findOne({ where: { email: t.email } });
            if (!counselor) {
                console.log('  Creating Counselor Entry...');
                await Counselor.create({
                    name: t.name,
                    email: t.email
                });
            } else {
                console.log('  Counselor Entry exists.');
            }
        }

        console.log('\n--- FINAL COUNSELOR TABLE STATE ---');
        const allCounselors = await Counselor.findAll();
        console.log(JSON.stringify(allCounselors, null, 2));

    } catch (err) {
        console.error('FATAL ERROR:', err);
    } finally {
        await sequelize.close();
    }
};

run();
