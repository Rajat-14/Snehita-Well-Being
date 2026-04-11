/**
 * seed_useful_links.js
 * ─────────────────────────────────────────────────────────
 * Restores the original Useful Links entries.
 *
 * HOW TO RUN (from the /server directory):
 *   node seed_useful_links.js
 * ─────────────────────────────────────────────────────────
 */

// Load .env manually (no dotenv dependency needed)
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

// Fix WSL / non-Docker host
if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('host.docker.internal', 'localhost');
}

const sequelize = require('./db/database');
const UsefulLink = require('./model/usefulLink');

const USEFUL_LINKS = [
    // ── Website links (with image) ────────────────────────────────────
    {
        title: 'Tele-MANAS',
        type: 'link',
        url: 'https://telemanas.mohfw.gov.in/#/home',
        // Official TeleMANAS banner image (direct URL — no upload needed)
        pic: 'https://telemanas.mohfw.gov.in/assets/images/tele-manas-logo.png',
    },
    {
        title: 'MANODARPAN',
        type: 'link',
        url: 'https://manodarpan.education.gov.in/',
        pic: 'https://manodarpan.education.gov.in/images/MHRD-Logo.png',
    },
    {
        title: 'iCall — Psychosocial Helpline',
        type: 'link',
        url: 'https://icallhelpline.org/',
        pic: 'https://icallhelpline.org/wp-content/uploads/2022/03/iCall-logo.png',
    },
    {
        title: 'Vandrevala Foundation',
        type: 'link',
        url: 'https://www.vandrevalafoundation.com/',
        pic: 'https://www.vandrevalafoundation.com/assets/images/logo.png',
    },

    // ── Helpline phone numbers ─────────────────────────────────────────
    {
        title: 'TeleMANAS Helpline',
        type: 'phone',
        url: '14416',
        pic: null,
    },
    {
        title: 'TeleMANAS Toll Free',
        type: 'phone',
        url: '1-800 891 4416',
        pic: null,
    },
    {
        title: 'Vandrevala Foundation Helpline',
        type: 'phone',
        url: '1860-2662-345',
        pic: null,
    },
    {
        title: 'iCall Helpline',
        type: 'phone',
        url: '9152987821',
        pic: null,
    },
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅  DB connected');

        let inserted = 0;
        for (const entry of USEFUL_LINKS) {
            const [, created] = await UsefulLink.findOrCreate({
                where: { title: entry.title },
                defaults: entry,
            });
            if (created) {
                console.log(`  ✔  Inserted: ${entry.title}`);
                inserted++;
            } else {
                console.log(`  ⏭️  Already exists, skipped: ${entry.title}`);
            }
        }

        console.log(`\n✅  Done! Inserted ${inserted} new useful link entries.`);
    } catch (err) {
        console.error('❌  Seed failed:', err.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seed();
