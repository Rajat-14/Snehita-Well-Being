/**
 * seed_appointments.js
 * ─────────────────────────────────────────────────────────
 * Inserts dummy Users + Appointments for testing purposes.
 *
 * HOW TO RUN (from the /server directory):
 *   node seed_appointments.js
 *
 * Safe to run multiple times — skips existing emails.
 * ─────────────────────────────────────────────────────────
 */

// Load .env manually (avoids dotenv dependency issues)
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

// Fix: host.docker.internal only resolves inside Docker containers.
// When running directly from WSL/Linux, use localhost instead.
if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('host.docker.internal', 'localhost');
    console.log('🔧  DB URL resolved to:', process.env.DATABASE_URL);
}

const sequelize = require('./db/database');
const User = require('./model/userSchema');
const Appointment = require('./model/appointment');

// ─── Helpers ────────────────────────────────────────────
const daysAgo  = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(0,0,0,0); return d; };
const daysAhead = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0,0,0,0); return d; };

const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
];

const COUNSELORS = ['Deepak Kumar', 'Gargi Tiwary'];

const PROBLEM_AREAS = [
    'Academics', 'Relationship', 'Family',
    'Finance', 'Health', 'Lifestyle related', 'Others'
];

const REFERRALS = [
    'Self', 'Faculty', 'Friend', 'Warden', 'Doctor', 'Parent', 'Snehita Buddy'
];

const slot  = (i) => TIME_SLOTS[i % TIME_SLOTS.length];
const coun  = (i) => COUNSELORS[i % COUNSELORS.length];
const prob  = (i) => PROBLEM_AREAS[i % PROBLEM_AREAS.length];
const ref   = (i) => REFERRALS[i % REFERRALS.length];

// ─── USERS ───────────────────────────────────────────────
const USERS_DATA = [
    { person_name: 'Aarav Sharma',      email: 'aarav.sharma.test@iitrpr.ac.in',    mobileNumber: '9876540001', gender: 'Male',   entryNumber: '2021CSB1001' },
    { person_name: 'Priya Singh',       email: 'priya.singh.test@iitrpr.ac.in',     mobileNumber: '9876540002', gender: 'Female', entryNumber: '2022EEB1002' },
    { person_name: 'Rohan Verma',       email: 'rohan.verma.test@iitrpr.ac.in',     mobileNumber: '9876540003', gender: 'Male',   entryNumber: '2020CHB1003' },
    { person_name: 'Sneha Patel',       email: 'sneha.patel.test@iitrpr.ac.in',     mobileNumber: '9876540004', gender: 'Female', entryNumber: '2023MEB1004' },
    { person_name: 'Vikram Nair',       email: 'vikram.nair.test@iitrpr.ac.in',     mobileNumber: '9876540005', gender: 'Male',   entryNumber: '2021CSB1005' },
    { person_name: 'Ananya Gupta',      email: 'ananya.gupta.test@iitrpr.ac.in',    mobileNumber: '9876540006', gender: 'Female', entryNumber: '2022PHZ0006' },
    { person_name: 'Karan Mehta',       email: 'karan.mehta.test@iitrpr.ac.in',     mobileNumber: '9876540007', gender: 'Male',   entryNumber: '2020EEB1007' },
    { person_name: 'Divya Reddy',       email: 'divya.reddy.test@iitrpr.ac.in',     mobileNumber: '9876540008', gender: 'Female', entryNumber: '2023CSB1008' },
    { person_name: 'Arjun Joshi',       email: 'arjun.joshi.test@iitrpr.ac.in',     mobileNumber: '9876540009', gender: 'Male',   entryNumber: '2021MEB1009' },
    { person_name: 'Meera Iyer',        email: 'meera.iyer.test@iitrpr.ac.in',      mobileNumber: '9876540010', gender: 'Female', entryNumber: '2022CHB1010' },
    { person_name: 'Siddharth Kumar',   email: 'siddharth.kumar.test@iitrpr.ac.in', mobileNumber: '9876540011', gender: 'Male',   entryNumber: '2020CSB1011' },
    { person_name: 'Pooja Agarwal',     email: 'pooja.agarwal.test@iitrpr.ac.in',   mobileNumber: '9876540012', gender: 'Female', entryNumber: '2023EEB1012' },
    { person_name: 'Rahul Tiwari',      email: 'rahul.tiwari.test@iitrpr.ac.in',    mobileNumber: '9876540013', gender: 'Male',   entryNumber: '2021PHZ0013' },
    { person_name: 'Kavya Pillai',      email: 'kavya.pillai.test@iitrpr.ac.in',    mobileNumber: '9876540014', gender: 'Female', entryNumber: '2022MEB1014' },
    { person_name: 'Amit Saxena',       email: 'amit.saxena.test@iitrpr.ac.in',     mobileNumber: '9876540015', gender: 'Male',   entryNumber: '2020CHB1015' },
    { person_name: 'Ishita Bose',       email: 'ishita.bose.test@iitrpr.ac.in',     mobileNumber: '9876540016', gender: 'Female', entryNumber: '2023CSB1016' },
    { person_name: 'Nikhil Desai',      email: 'nikhil.desai.test@iitrpr.ac.in',    mobileNumber: '9876540017', gender: 'Male',   entryNumber: '2021EEB1017' },
    { person_name: 'Riya Choudhary',    email: 'riya.choudhary.test@iitrpr.ac.in',  mobileNumber: '9876540018', gender: 'Female', entryNumber: '2022PHZ0018' },
    { person_name: 'Harsh Pandey',      email: 'harsh.pandey.test@iitrpr.ac.in',    mobileNumber: '9876540019', gender: 'Male',   entryNumber: '2020MEB1019' },
    { person_name: 'Simran Kaur',       email: 'simran.kaur.test@iitrpr.ac.in',     mobileNumber: '9876540020', gender: 'Female', entryNumber: '2023CHB1020' },
];

// ─── APPOINTMENT TEMPLATES ───────────────────────────────
// Each entry is a function (userId, user) => appointment object
// Dates are spread across: 6 months ago, 3 months ago, 1 month ago,
// 2 weeks ago, last week, yesterday, today, tomorrow, next week, next month
const buildAppointments = (users) => {
    const appts = [];
    const u = users; // shorthand

    // ── RESOLVED — completed cases with progress scores ──────────────
    appts.push({
        userId: u[0].id, fullName: u[0].person_name, email: u[0].email,
        mobileNumber: 9876540001, age: 21, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(180), timeSlot: slot(0),
        problemDescription: 'Unable to concentrate during exams, constant fear of failing despite studying hard.',
        problemExtent: 'Severe', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'resolved',
        notes: 'Student showed significant improvement after 3 sessions. Cognitive restructuring techniques applied.',
        progressScore: 8,
    });
    appts.push({
        userId: u[0].id, fullName: u[0].person_name, email: u[0].email,
        mobileNumber: 9876540001, age: 21, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(150), timeSlot: slot(1),
        problemDescription: 'Follow-up: Academic anxiety reduced. Now struggling with time management.',
        problemExtent: 'Moderate', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'resolved',
        notes: 'Introduced Pomodoro technique and weekly goal-setting. Student is progressing well.',
        progressScore: 9,
    });

    appts.push({
        userId: u[1].id, fullName: u[1].person_name, email: u[1].email,
        mobileNumber: 9876540002, age: 20, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(120), timeSlot: slot(2),
        problemDescription: 'Experiencing severe homesickness and difficulty adjusting to hostel life.',
        problemExtent: 'Moderate', problemRelatedWith: 'Family',
        modeOfReferral: 'Snehita Buddy', status: 'resolved',
        notes: 'Encouraged participation in group activities. Scheduled regular calls with family. Adjustment improving.',
        progressScore: 7,
    });

    appts.push({
        userId: u[2].id, fullName: u[2].person_name, email: u[2].email,
        mobileNumber: 9876540003, age: 22, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(90), timeSlot: slot(3),
        problemDescription: 'Breakup with long-term partner causing emotional distress and inability to focus.',
        problemExtent: 'Severe', problemRelatedWith: 'Relationship',
        modeOfReferral: 'Friend', status: 'resolved',
        notes: 'Multiple sessions on emotional regulation. Student has accepted the situation. Significant recovery observed.',
        progressScore: 6,
    });

    appts.push({
        userId: u[3].id, fullName: u[3].person_name, email: u[3].email,
        mobileNumber: 9876540004, age: 19, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(60), timeSlot: slot(4),
        problemDescription: 'Suffering from insomnia due to excessive screen time and irregular sleep schedule.',
        problemExtent: 'Mild', problemRelatedWith: 'Lifestyle related',
        modeOfReferral: 'Self', status: 'resolved',
        notes: 'Sleep hygiene education provided. Student now follows a fixed sleep schedule. Significant improvement.',
        progressScore: 9,
    });

    appts.push({
        userId: u[4].id, fullName: u[4].person_name, email: u[4].email,
        mobileNumber: 9876540005, age: 23, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(45), timeSlot: slot(5),
        problemDescription: 'Financial stress due to delay in scholarship disbursement affecting daily life.',
        problemExtent: 'Moderate', problemRelatedWith: 'Finance',
        modeOfReferral: 'Warden', status: 'resolved',
        notes: 'Referred to Dean Student Affairs for emergency fund. Also worked on coping strategies for financial anxiety.',
        progressScore: 7,
    });

    appts.push({
        userId: u[5].id, fullName: u[5].person_name, email: u[5].email,
        mobileNumber: 9876540006, age: 25, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(30), timeSlot: slot(0),
        problemDescription: 'PhD thesis pressure causing panic attacks and difficulty breathing during high-stress moments.',
        problemExtent: 'Severe', problemRelatedWith: 'Academics',
        modeOfReferral: 'Faculty', status: 'resolved',
        notes: 'Breathing exercises and progressive muscle relaxation. Student reports panic attacks have reduced to once a week.',
        progressScore: 6,
    });

    appts.push({
        userId: u[6].id, fullName: u[6].person_name, email: u[6].email,
        mobileNumber: 9876540007, age: 22, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(15), timeSlot: slot(1),
        problemDescription: 'Social anxiety making group presentations and classroom interactions extremely difficult.',
        problemExtent: 'Moderate', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'resolved',
        notes: 'Gradual exposure therapy plan created. Student successfully gave a 5-minute class presentation.',
        progressScore: 7,
    });

    // ── FOLLOW-UP — ongoing cases ─────────────────────────────────────
    appts.push({
        userId: u[7].id, fullName: u[7].person_name, email: u[7].email,
        mobileNumber: 9876540008, age: 19, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(60), timeSlot: slot(2),
        problemDescription: 'Persistent sadness, loss of interest in studies and friends. Possible depressive symptoms.',
        problemExtent: 'Severe', problemRelatedWith: 'Others',
        modeOfReferral: 'Friend', status: 'followup',
        notes: 'Referred to psychiatrist for evaluation. Continuing counselling sessions alongside.',
        progressScore: 4,
    });
    appts.push({
        userId: u[7].id, fullName: u[7].person_name, email: u[7].email,
        mobileNumber: 9876540008, age: 19, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(30), timeSlot: slot(3),
        problemDescription: 'Follow-up session: Medication started by psychiatrist. Mood slightly improved.',
        problemExtent: 'Moderate', problemRelatedWith: 'Others',
        modeOfReferral: 'Self', status: 'followup',
        notes: 'Continuity of care maintained. Sleep and appetite improving. Scheduling once per fortnight.',
        progressScore: 5,
    });

    appts.push({
        userId: u[8].id, fullName: u[8].person_name, email: u[8].email,
        mobileNumber: 9876540009, age: 21, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(45), timeSlot: slot(4),
        problemDescription: 'Conflict with roommate turning hostile, affecting sleeping and studying.',
        problemExtent: 'Moderate', problemRelatedWith: 'Relationship',
        modeOfReferral: 'Warden', status: 'followup',
        notes: 'Mediated conflict. Temporary room change arranged. Anger management strategies shared.',
        progressScore: 5,
    });
    appts.push({
        userId: u[8].id, fullName: u[8].person_name, email: u[8].email,
        mobileNumber: 9876540009, age: 21, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(10), timeSlot: slot(5),
        problemDescription: 'Follow-up: Conflict somewhat resolved but trust issues remain.',
        problemExtent: 'Mild', problemRelatedWith: 'Relationship',
        modeOfReferral: 'Self', status: 'followup',
        notes: 'Continuing communication skills training. Planning joint session with both students.',
        progressScore: 6,
    });

    appts.push({
        userId: u[9].id, fullName: u[9].person_name, email: u[9].email,
        mobileNumber: 9876540010, age: 24, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(90), timeSlot: slot(0),
        problemDescription: 'Parental pressure to switch branch; student wants to pursue research but parents insist on placements.',
        problemExtent: 'Moderate', problemRelatedWith: 'Family',
        modeOfReferral: 'Self', status: 'followup',
        notes: 'Values clarification exercises done. Letter template for family communication prepared.',
        progressScore: 4,
    });
    appts.push({
        userId: u[9].id, fullName: u[9].person_name, email: u[9].email,
        mobileNumber: 9876540010, age: 24, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(55), timeSlot: slot(1),
        problemDescription: 'Family talk had some positive outcome. Student still anxious about future.',
        problemExtent: 'Mild', problemRelatedWith: 'Family',
        modeOfReferral: 'Self', status: 'followup',
        notes: 'Career counselling resources shared. Connecting with alumni who took research path.',
        progressScore: 6,
    });
    appts.push({
        userId: u[9].id, fullName: u[9].person_name, email: u[9].email,
        mobileNumber: 9876540010, age: 24, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAhead(7), timeSlot: slot(2),
        problemDescription: 'Third follow-up: Scheduled to discuss progress after family meeting.',
        problemExtent: 'Mild', problemRelatedWith: 'Family',
        modeOfReferral: 'Self', status: 'confirmed',
        notes: null, progressScore: null,
    });

    // ── ABSENT — student didn't show up ─────────────────────────────
    appts.push({
        userId: u[10].id, fullName: u[10].person_name, email: u[10].email,
        mobileNumber: 9876540011, age: 22, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(20), timeSlot: slot(3),
        problemDescription: 'Reported feeling worthless and having dark thoughts. Flagged as red case.',
        problemExtent: 'Severe', problemRelatedWith: 'Others',
        modeOfReferral: 'Faculty', status: 'absent',
        notes: 'Student did not show up despite confirmation. Emergency contact notified. Follow-up attempted.',
        progressScore: null,
    });

    appts.push({
        userId: u[11].id, fullName: u[11].person_name, email: u[11].email,
        mobileNumber: 9876540012, age: 20, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(8), timeSlot: slot(4),
        problemDescription: 'Body image issues and restrictive eating reported by friend.',
        problemExtent: 'Moderate', problemRelatedWith: 'Health',
        modeOfReferral: 'Friend', status: 'absent',
        notes: 'No show. Outreach email sent by counsellor.',
        progressScore: null,
    });

    appts.push({
        userId: u[12].id, fullName: u[12].person_name, email: u[12].email,
        mobileNumber: 9876540013, age: 23, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(3), timeSlot: slot(5),
        problemDescription: 'Substance use concern raised by warden.',
        problemExtent: 'Severe', problemRelatedWith: 'Health',
        modeOfReferral: 'Warden', status: 'absent',
        notes: 'Student absent. Warden informed. Following up via buddy network.',
        progressScore: null,
    });

    appts.push({
        userId: u[13].id, fullName: u[13].person_name, email: u[13].email,
        mobileNumber: 9876540014, age: 20, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(40), timeSlot: slot(0),
        problemDescription: 'Performance anxiety related to competitive exams.',
        problemExtent: 'Mild', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'absent',
        notes: 'Second no-show. Rescheduled.',
        progressScore: null,
    });

    // ── CONFIRMED — upcoming appointments ────────────────────────────
    appts.push({
        userId: u[14].id, fullName: u[14].person_name, email: u[14].email,
        mobileNumber: 9876540015, age: 21, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAhead(2), timeSlot: slot(1),
        problemDescription: 'Chronic procrastination leading to backlogs in multiple courses.',
        problemExtent: 'Moderate', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'confirmed',
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[15].id, fullName: u[15].person_name, email: u[15].email,
        mobileNumber: 9876540016, age: 22, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAhead(5), timeSlot: slot(2),
        problemDescription: 'Grief counselling after loss of grandfather. Inability to process emotions.',
        problemExtent: 'Severe', problemRelatedWith: 'Family',
        modeOfReferral: 'Parent', status: 'confirmed',
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[16].id, fullName: u[16].person_name, email: u[16].email,
        mobileNumber: 9876540017, age: 26, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAhead(10), timeSlot: slot(3),
        problemDescription: 'Feeling isolated as the only student from a non-metro background in the lab group.',
        problemExtent: 'Mild', problemRelatedWith: 'Relationship',
        modeOfReferral: 'Self', status: 'confirmed',
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[17].id, fullName: u[17].person_name, email: u[17].email,
        mobileNumber: 9876540018, age: 22, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAhead(14), timeSlot: slot(4),
        problemDescription: 'Internship rejection causing severe self-doubt and comparison with peers.',
        problemExtent: 'Moderate', problemRelatedWith: 'Academics',
        modeOfReferral: 'Friend', status: 'confirmed',
        notes: null, progressScore: null,
    });

    // ── PENDING — new requests not yet accepted ───────────────────────
    appts.push({
        userId: u[18].id, fullName: u[18].person_name, email: u[18].email,
        mobileNumber: 9876540019, age: 23, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAhead(3), timeSlot: slot(0),
        problemDescription: 'Aggression outbursts during lab hours. Referred by lab supervisor.',
        problemExtent: 'Moderate', problemRelatedWith: 'Others',
        modeOfReferral: 'Faculty', status: 'pending',
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[19].id, fullName: u[19].person_name, email: u[19].email,
        mobileNumber: 9876540020, age: 21, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAhead(4), timeSlot: slot(1),
        problemDescription: 'Difficulty managing long-distance relationship while handling academic pressure.',
        problemExtent: 'Mild', problemRelatedWith: 'Relationship',
        modeOfReferral: 'Self', status: 'pending',
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[0].id, fullName: u[0].person_name, email: u[0].email,
        mobileNumber: 9876540001, age: 21, gender: 'Male',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAhead(6), timeSlot: slot(2),
        problemDescription: 'CGPA drop panic. First time seeking help after years of being a top ranker.',
        problemExtent: 'Severe', problemRelatedWith: 'Academics',
        modeOfReferral: 'Self', status: 'pending',
        notes: null, progressScore: null,
    });

    // ── REJECTED ──────────────────────────────────────────────────────
    appts.push({
        userId: u[2].id, fullName: u[2].person_name, email: u[2].email,
        mobileNumber: 9876540003, age: 22, gender: 'Male',
        counselorName: 'Deepak Kumar',
        appointmentDate: daysAgo(100), timeSlot: slot(5),
        problemDescription: 'Wanted to cancel the slot.',
        problemExtent: 'Mild', problemRelatedWith: 'Others',
        modeOfReferral: 'Self', status: 'rejected',
        rejectionNote: "As per the student's request, appointment was cancelled.",
        notes: null, progressScore: null,
    });

    appts.push({
        userId: u[5].id, fullName: u[5].person_name, email: u[5].email,
        mobileNumber: 9876540006, age: 25, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(70), timeSlot: slot(0),
        problemDescription: 'Initial panic attack concern — rescheduled to a better slot.',
        problemExtent: 'Moderate', problemRelatedWith: 'Academics',
        modeOfReferral: 'Faculty', status: 'rejected',
        rejectionNote: 'I have an urgent meeting to attend. Rescheduled with student agreement.',
        notes: null, progressScore: null,
    });

    // ── POSTPONED ─────────────────────────────────────────────────────
    appts.push({
        userId: u[11].id, fullName: u[11].person_name, email: u[11].email,
        mobileNumber: 9876540012, age: 20, gender: 'Female',
        counselorName: 'Gargi Tiwary',
        appointmentDate: daysAgo(25), timeSlot: slot(3),
        problemDescription: 'Follow-up on body image issues.',
        problemExtent: 'Moderate', problemRelatedWith: 'Health',
        modeOfReferral: 'Self', status: 'postponed',
        rejectionNote: 'I am on unexpected leave today.',
        notes: null, progressScore: null,
    });

    // ── ADDITIONAL DIVERSITY — mixed dates & counselors ──────────────
    const extras = [
        { ui: 1,  da: daysAgo(200), s:'resolved', e:'Mild',     p:'Lifestyle related', r:'Self',          notes:'Sleep schedule fixed. Diet improved.', ps:8,   c:'Deepak Kumar' },
        { ui: 3,  da: daysAgo(170), s:'resolved', e:'Moderate', p:'Academics',         r:'Faculty',       notes:'Academic plan restructured.',          ps:7,   c:'Gargi Tiwary' },
        { ui: 6,  da: daysAgo(140), s:'absent',   e:'Severe',   p:'Health',            r:'Doctor',        notes:'No-show. Medical emergency.',           ps:null,c:'Deepak Kumar' },
        { ui: 7,  da: daysAgo(110), s:'followup', e:'Severe',   p:'Others',            r:'Friend',        notes:'Monitoring closely. Weekly check-in.',  ps:3,   c:'Gargi Tiwary' },
        { ui: 12, da: daysAgo(80),  s:'resolved', e:'Moderate', p:'Finance',           r:'Warden',        notes:'Counselled on budgeting & resources.',   ps:8,   c:'Deepak Kumar' },
        { ui: 14, da: daysAgo(50),  s:'confirmed',e:'Mild',     p:'Relationship',      r:'Self',          notes:null,                                     ps:null,c:'Gargi Tiwary' },
        { ui: 16, da: daysAgo(35),  s:'resolved', e:'Moderate', p:'Academics',         r:'Snehita Buddy', notes:'Regained study motivation.',             ps:9,   c:'Deepak Kumar' },
        { ui: 18, da: daysAgo(22),  s:'absent',   e:'Mild',     p:'Relationship',      r:'Friend',        notes:'Absent. Emailed for rescheduling.',      ps:null,c:'Gargi Tiwary' },
        { ui: 0,  da: daysAgo(10),  s:'resolved', e:'Moderate', p:'Academics',         r:'Self',          notes:'Third session. Student doing well.',     ps:9,   c:'Deepak Kumar' },
        { ui: 4,  da: daysAgo(7),   s:'followup', e:'Moderate', p:'Finance',           r:'Warden',        notes:'Financial aid processed. Stress lower.', ps:6,   c:'Gargi Tiwary' },
        { ui: 8,  da: daysAhead(1), s:'confirmed',e:'Mild',     p:'Relationship',      r:'Self',          notes:null,                                     ps:null,c:'Deepak Kumar' },
        { ui: 13, da: daysAhead(3), s:'pending',  e:'Moderate', p:'Academics',         r:'Faculty',       notes:null,                                     ps:null,c:'Gargi Tiwary' },
        { ui: 15, da: daysAhead(8), s:'confirmed',e:'Severe',   p:'Family',            r:'Parent',        notes:null,                                     ps:null,c:'Deepak Kumar' },
        { ui: 19, da: daysAhead(9), s:'pending',  e:'Mild',     p:'Lifestyle related', r:'Self',          notes:null,                                     ps:null,c:'Gargi Tiwary' },
        { ui: 2,  da: daysAgo(130), s:'resolved', e:'Severe',   p:'Relationship',      r:'Friend',        notes:'Student reports emotional healing.',     ps:7,   c:'Gargi Tiwary' },
        { ui: 10, da: daysAgo(14),  s:'absent',   e:'Severe',   p:'Others',            r:'Faculty',       notes:'Second no-show. Red-flag escalated.',    ps:null,c:'Deepak Kumar' },
        { ui: 17, da: daysAgo(5),   s:'followup', e:'Moderate', p:'Academics',         r:'Friend',        notes:'Self-doubt partially addressed.',        ps:5,   c:'Gargi Tiwary' },
        { ui: 1,  da: daysAgo(2),   s:'resolved', e:'Mild',     p:'Family',            r:'Self',          notes:'Homesickness fully resolved.',           ps:10,  c:'Deepak Kumar' },
    ];

    extras.forEach((ex) => {
        const usr = users[ex.ui];
        appts.push({
            userId: usr.id, fullName: usr.person_name, email: usr.email,
            mobileNumber: Number(usr.mobileNumber),
            age: 19 + (ex.ui % 8),
            gender: usr.gender,
            counselorName: ex.c,
            appointmentDate: ex.da,
            timeSlot: slot(ex.ui),
            problemDescription: `[Test] Issue related to ${ex.p} — ${ex.e} case referred by ${ref(ex.ui)}.`,
            problemExtent: ex.e,
            problemRelatedWith: ex.p,
            modeOfReferral: ref(ex.ui),
            status: ex.s,
            notes: ex.notes,
            rejectionNote: null,
            progressScore: ex.ps,
        });
    });

    return appts;
};

// ─── MAIN ────────────────────────────────────────────────
const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅  DB connected');

        await sequelize.sync({ alter: false }); // ensure models exist, no destructive sync

        // ── Insert users (skip if email already exists) ──────────────
        const insertedUsers = [];
        for (const u of USERS_DATA) {
            const [user, created] = await User.findOrCreate({
                where: { email: u.email },
                defaults: u,
            });
            if (created) console.log(`  👤 Created user: ${user.person_name}`);
            else         console.log(`  ⏭️  Skipped (exists): ${user.person_name}`);
            insertedUsers.push(user);
        }

        console.log(`\n✅  ${insertedUsers.length} users ready. Building appointments...\n`);

        // ── Build & insert appointments ──────────────────────────────
        const appointments = buildAppointments(insertedUsers);
        let created = 0;
        for (const appt of appointments) {
            await Appointment.create(appt);
            created++;
        }

        console.log(`\n✅  Done! Inserted ${created} appointment records.`);
        console.log('    Statuses included: resolved, followup, absent, confirmed, pending, rejected, postponed');
        console.log('    Date range: ~6 months ago → ~2 weeks ahead\n');

    } catch (err) {
        console.error('❌  Seed failed:', err.message);
        if (err.errors) err.errors.forEach(e => console.error('   ', e.message));
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seed();
