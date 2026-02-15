require('dotenv').config();

// Patch DATABASE_URL to use localhost before loading database.js
if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('host.docker.internal', 'localhost');
}

const sequelize = require('./db/database');
const User = require('./model/userSchema');
const Counselor = require('./model/counselor');
const bcrypt = require('bcrypt');

const fixPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const email = '2023csb1171+coun01@iitrpr.ac.in';
        const newPassword = '1234';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log(`Updating password for email: ${email}`);

        const user = await User.findOne({ where: { email: email } });
        if (user) {
            user.password = hashedPassword;
            // modify directly to avoid hooks if needed, but save should trigger hook if changed. 
            // However, hook hashes if changed. If I set it to hash, hook might hash the hash?
            // User model hook: if (user.changed('password')) { user.password = await bcrypt.hash(user.password, 10); }
            // If I set user.password = hash, changed('password') is true. Hook will hash again!
            // So I should set user.password to plaintext '1234' and let the hook hash it?
            // BUT the current value IS '1234'. So changed('password') might return false if I set it to '1234' again?
            // Actually, Sequelize 'changed' checks against the value loaded from DB.
            // DB has '1234'. If I set to '1234', it might not verify as changed.
            // AND the problem is that it IS '1234' in DB.

            // To force update, I can use `User.update` with `hooks: true` (default) or `hooks: false` if I provide hash.
            // The cleanest way is to use `User.update` with the plaintext password, ensuring the hook runs.
            // But wait, if the DB already has '1234', an update to '1234' won't change anything?
            // I should probably set it to something else temporarily or just force the update.

            // Actually, looking at the model:
            // beforeSave: async (user) => { if (user.changed('password')) ... }

            // I will use `update` method.
            // But if I pass '1234', and DB has '1234', sequelize might verify no change.
            // So I will pass the HASHED password and set `hooks: false` to avoid double hashing.

            await User.update({ password: hashedPassword }, {
                where: { email: email },
                hooks: false
            });
            console.log('User password updated (hashed).');
        } else {
            console.log('User NOT found.');
        }

        const counselor = await Counselor.findOne({ where: { email: email } });
        if (counselor) {
            await Counselor.update({ password: hashedPassword }, {
                where: { email: email },
                hooks: false
            });
            console.log('Counselor password updated (hashed).');
        } else {
            console.log('Counselor NOT found.');
        }

    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await sequelize.close();
    }
};

fixPassword();
