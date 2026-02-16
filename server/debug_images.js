const fs = require('fs');
const path = require('path');
require('dotenv').config();
const TeamMember = require('./model/teamMember');
const sequelize = require('./db/database');

const debugImages = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const buddies = await TeamMember.findAll({ where: { type: 'buddy' } });
        console.log(`Found ${buddies.length} buddies in DB.`);

        buddies.forEach(buddy => {
            const dbPath = buddy.image;
            console.log(`Checking buddy: ${buddy.name}, DB Image Path: ${dbPath}`);

            if (!dbPath) {
                console.log('  -> No image path in DB.');
                return;
            }

            // Remove '/uploads' prefix to get file system path relative to 'uploads' dir
            // Expected dbPath: /uploads/team/buddies/filename.svg
            // We serve 'uploads' folder at '/uploads'.
            // So on disk, it should be path.join(__dirname, 'uploads', dbPath.replace('/uploads', ''))

            let relativePath = dbPath;
            if (relativePath.startsWith('/uploads')) {
                relativePath = relativePath.substring('/uploads'.length);
            }

            // Handle double slashes if any
            if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
                relativePath = relativePath.substring(1);
            }

            const fullPath = path.join(__dirname, 'uploads', relativePath);

            if (fs.existsSync(fullPath)) {
                console.log(`  -> File EXISTS at: ${fullPath}`);
            } else {
                console.log(`  -> File MISSING at: ${fullPath}`);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

debugImages();
