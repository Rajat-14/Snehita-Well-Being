const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/userSchema');
const Role = require('../model/role');
const Counselor = require('../model/counselor');
const OrganizationInfo = require('../model/organizationInfo');
const ContactDetail = require('../model/contactDetail');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.SECRET || 'abcdef';

// ──────────────────────────────────────────────
// Admin Login (password-based, not OTP)
// ──────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
        { role: 'admin', email: ADMIN_EMAIL },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res
        .cookie('admintoken', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 8 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: 'Admin login successful', role: 'admin' });
};

// ──────────────────────────────────────────────
// Admin Logout
// ──────────────────────────────────────────────
exports.adminLogout = (req, res) => {
    res.clearCookie('admintoken');
    res.status(200).json({ message: 'Logged out successfully' });
};

// ──────────────────────────────────────────────
// Verify admin session
// ──────────────────────────────────────────────
exports.verifyAdmin = (req, res) => {
    res.status(200).json({ message: 'Authorized', role: 'admin' });
};

// ──────────────────────────────────────────────
// Organization Info (About Us) — CRUD
// ──────────────────────────────────────────────
exports.getOrganizationInfo = async (req, res) => {
    try {
        const info = await OrganizationInfo.findAll({ order: [['type', 'ASC']] });
        res.status(200).json(info);
    } catch (error) {
        console.error('Error fetching org info:', error);
        res.status(500).json({ error: 'Error fetching organization info' });
    }
};

exports.updateOrganizationInfo = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const info = await OrganizationInfo.findByPk(req.params.id);
        if (!info) {
            return res.status(404).json({ error: 'Organization info not found' });
        }
        await info.update({
            title: title !== undefined ? title : info.title,
            description: description !== undefined ? description : info.description,
            type: type !== undefined ? type : info.type,
        });
        res.status(200).json(info);
    } catch (error) {
        console.error('Error updating org info:', error);
        res.status(500).json({ error: 'Error updating organization info' });
    }
};

exports.createOrganizationInfo = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const info = await OrganizationInfo.create({ title, description, type });
        res.status(201).json(info);
    } catch (error) {
        console.error('Error creating org info:', error);
        res.status(500).json({ error: 'Error creating organization info' });
    }
};

exports.deleteOrganizationInfo = async (req, res) => {
    try {
        const info = await OrganizationInfo.findByPk(req.params.id);
        if (!info) return res.status(404).json({ error: 'Organization info not found' });
        await info.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting org info:', error);
        res.status(500).json({ error: 'Error deleting organization info' });
    }
};

// ──────────────────────────────────────────────
// Contact Details — CRUD
// ──────────────────────────────────────────────
exports.getContactDetails = async (req, res) => {
    try {
        const contacts = await ContactDetail.findAll();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contact details:', error);
        res.status(500).json({ error: 'Error fetching contact details' });
    }
};

exports.updateContactDetail = async (req, res) => {
    try {
        const contact = await ContactDetail.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Contact detail not found' });

        const fields = [
            'location', 'addressLine1', 'addressLine2', 'addressLine3',
            'city', 'state', 'country', 'postalCode', 'email', 'mapsLink', 'isActive'
        ];
        const updates = {};
        fields.forEach(f => {
            if (req.body[f] !== undefined) updates[f] = req.body[f];
        });
        await contact.update(updates);
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error updating contact detail:', error);
        res.status(500).json({ error: 'Error updating contact detail' });
    }
};

exports.createContactDetail = async (req, res) => {
    try {
        const {
            location, addressLine1, addressLine2, addressLine3,
            city, state, country, postalCode, email, mapsLink
        } = req.body;
        const contact = await ContactDetail.create({
            location, addressLine1, addressLine2, addressLine3,
            city, state, country, postalCode, email, mapsLink
        });
        res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact detail:', error);
        res.status(500).json({ error: 'Error creating contact detail' });
    }
};

// ──────────────────────────────────────────────
// Add Counselor
// ──────────────────────────────────────────────
exports.addCounselor = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create the user record
            user = await User.create({
                person_name: name,
                email,
                mobileNumber: null,
                gender: null,
            });
        }

        // Check or create role
        let roleEntry = await Role.findOne({ where: { email } });
        if (roleEntry) {
            if (roleEntry.role === 'counselor') {
                return res.status(409).json({ error: 'This email is already registered as a counselor' });
            }
            // Update existing role to counselor
            await roleEntry.update({ role: 'counselor' });
        } else {
            await Role.create({ email, role: 'counselor' });
        }

        // Check if counselor record already exists
        const existingCounselor = await Counselor.findOne({ where: { email } });
        if (existingCounselor) {
            return res.status(409).json({ error: 'Counselor record already exists for this email' });
        }

        // Create counselor record
        const counselor = await Counselor.create({ name, email });

        res.status(201).json({
            message: 'Counselor added successfully',
            counselor: { id: counselor.id, name: counselor.name, email: counselor.email },
        });
    } catch (error) {
        console.error('Error adding counselor:', error);
        res.status(500).json({ error: 'Error adding counselor' });
    }
};

// Get all counselors
exports.getCounselors = async (req, res) => {
    try {
        const counselors = await Counselor.findAll({
            attributes: ['id', 'name', 'email', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(counselors);
    } catch (error) {
        console.error('Error fetching counselors:', error);
        res.status(500).json({ error: 'Error fetching counselors' });
    }
};

// Delete a counselor
exports.deleteCounselor = async (req, res) => {
    try {
        const counselor = await Counselor.findByPk(req.params.id);
        if (!counselor) return res.status(404).json({ error: 'Counselor not found' });
        await counselor.destroy();
        res.status(200).json({ message: 'Counselor removed successfully' });
    } catch (error) {
        console.error('Error deleting counselor:', error);
        res.status(500).json({ error: 'Error deleting counselor' });
    }
};
