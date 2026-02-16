const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const sequelize = require('./db/database');
const TeamMember = require('./model/teamMember');

async function renameKrishna() {
    try {
        await sequelize.authenticate();

        const oldFile = path.join(__dirname, 'uploads/team/buddies/KRISHNAKUMAR.svg');
        const newFile = path.join(__dirname, 'uploads/team/buddies/krishna.svg');

        // 1. Rename file on disk if it exists
        if (fs.existsSync(oldFile)) {
            fs.renameSync(oldFile, newFile);
            console.log("Renamed KRISHNAKUMAR.svg to krishna.svg");
        } else if (fs.existsSync(newFile)) {
            console.log("krishna.svg already exists (renamed previously?)");
        } else {
            console.log("Could not find KRISHNAKUMAR.svg to rename");
            // Just in case we already moved it or something, check if we can copy it back?
            // Not doing that here to keep it simple.
        }

        // 2. Update DB
        const krishna = await TeamMember.findOne({ where: { name: 'Krishna Kumar' } });
        if (krishna) {
            await krishna.update({ image: "/uploads/team/buddies/krishna.svg" });
            console.log("Updated Krishna DB record to /uploads/team/buddies/krishna.svg");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

renameKrishna();
