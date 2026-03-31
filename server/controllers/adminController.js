const OrganizationInfo = require("../model/organizationInfo");
const TeamMember = require("../model/teamMember");
const User = require("../model/userSchema");
const Role = require("../model/role");
const Counselor = require("../model/counselor");

// --- Organization Info (Snehita part) ---
exports.getOrgInfo = async (req, res) => {
    try {
        const info = await OrganizationInfo.findAll({ order: [['order', 'ASC'], ['createdAt', 'ASC']] });
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.reorderOrgInfo = async (req, res) => {
    try {
        const { items } = req.body;
        for (let item of items) {
           await OrganizationInfo.update({ order: item.order }, { where: { id: item.id } });
        }
        res.status(200).json({ message: "Reordered successfully" });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
};

exports.addOrgInfo = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const newInfo = await OrganizationInfo.create({ title, description, type });
        res.status(201).json(newInfo);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateOrgInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type } = req.body;
        const info = await OrganizationInfo.findByPk(id);
        if (!info) return res.status(404).json({ error: "Not found" });
        
        info.title = title || info.title;
        info.description = description || info.description;
        info.type = type || info.type;
        await info.save();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteOrgInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const info = await OrganizationInfo.findByPk(id);
        if (!info) return res.status(404).json({ error: "Not found" });
        await info.destroy();
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// --- Team Members (Director, Dean, Faculty Advisors, Counselors) ---
exports.getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.addTeamMember = async (req, res) => {
    try {
        const { name, designation, type, email, telephoneNo, image, experience, academicDesignation, message, course, instaId, linkedinId, order, isActive, location } = req.body;
        const member = await TeamMember.create({
            name, designation, type, email, telephoneNo, image, experience, academicDesignation, message, course, instaId, linkedinId, order, isActive, location
        });

        // Special handling for counselor setup
        if (type === 'counsellor' && email) {
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({ person_name: name, email, mobileNumber: telephoneNo });
                await Role.create({ email, role: 'counselor' });
            }
            const existingCounselor = await Counselor.findOne({ where: { email } });
            if (!existingCounselor) {
                await Counselor.create({ name, email, location });
            }
        }

        res.status(201).json(member);
    } catch (error) {
        console.error("Add Team Member Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateTeamMember = async (req, res) => {
    try {
        const payload = { ...req.body };
        const member = await TeamMember.findByPk(req.params.id);
        if (!member) return res.status(404).json({ error: "Not found" });

        if (payload.image && member.image && member.image !== payload.image) {
            if (member.image.startsWith('/uploads/')) {
                const fs = require('fs');
                const path = require('path');
                const fullPath = path.join(__dirname, '..', member.image);
                if (fs.existsSync(fullPath)) {
                    try { fs.unlinkSync(fullPath); } catch (e) { console.error("File update delete err:", e); }
                }
            }
        }

        const oldEmail = member.email;
        Object.assign(member, req.body);
        await member.save();
        
        // Handle User/Counselor sync on update
        if (member.type === 'counsellor') {
            const currentEmail = member.email;
            if (currentEmail) {
                let user = await User.findOne({ where: { email: currentEmail } });
                if (!user) {
                    await User.create({ person_name: member.name, email: currentEmail, mobileNumber: member.telephoneNo });
                    await Role.create({ email: currentEmail, role: 'counselor' });
                    await Counselor.create({ name: member.name, email: currentEmail, location: member.location });
                } else {
                    await User.update({ person_name: member.name, mobileNumber: member.telephoneNo }, { where: { email: currentEmail } });
                    await Counselor.update({ name: member.name, location: member.location }, { where: { email: currentEmail } });
                }
            }
        }
        
        res.status(200).json(member);
    } catch (error) {
        console.error("Update Team Member Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await TeamMember.findByPk(id);
        if (!member) return res.status(404).json({ error: "Not found" });
        const deletedType = member.type;
        const deletedEmail = member.email;
        const imagePath = member.image;
        await member.destroy();

        if (imagePath && imagePath.startsWith('/uploads/')) {
            const fs = require('fs');
            const path = require('path');
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
                try { fs.unlinkSync(fullPath); } catch (e) { console.error("File delete err:", e); }
            }
        }

        // Cascade delete if it's a counsellor
        if (deletedType === 'counsellor' && deletedEmail) {
            try {
                await Counselor.destroy({ where: { email: deletedEmail }});
                await Role.destroy({ where: { email: deletedEmail }});
                await User.destroy({ where: { email: deletedEmail }});
            } catch (err) {
                console.error("Cleanup sync failed but member was deleted:", err);
            }
        }
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// --- Upload Image ---
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        // The file path returned starts with `/uploads/...` which our frontend expects
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Upload Image Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.reorderTeamMembers = async (req, res) => {
    try {
        const { items } = req.body;
        for (let item of items) {
           await TeamMember.update({ order: item.order }, { where: { id: item.id } });
        }
        res.status(200).json({ message: "Reordered successfully" });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
};

