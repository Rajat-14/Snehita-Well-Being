const TeamMember = require('../model/teamMember');

// Get all active team members
exports.getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamMember.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']]
        });
        const parsed = teamMembers.map(tm => {
            const obj = tm.toJSON();
            if (obj.message && typeof obj.message === 'string') {
                try { obj.message = JSON.parse(obj.message); } catch (e) { /* keep as-is */ }
            }
            return obj;
        });
        res.status(200).json(parsed);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Error fetching team members' });
    }
};

// Get team members by type
exports.getTeamMembersByType = async (req, res) => {
    try {
        const { type } = req.params;
        const teamMembers = await TeamMember.findAll({
            where: { type, isActive: true },
            order: [['order', 'ASC']]
        });
        const parsed = teamMembers.map(tm => {
            const obj = tm.toJSON();
            if (obj.message && typeof obj.message === 'string') {
                try { obj.message = JSON.parse(obj.message); } catch (e) { }
            }
            return obj;
        });
        res.status(200).json(parsed);
    } catch (error) {
        console.error('Error fetching team members by type:', error);
        res.status(500).json({ error: 'Error fetching team members by type' });
    }
};

// Get team member by id
exports.getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        const obj = teamMember.toJSON();
        if (obj.message && typeof obj.message === 'string') {
            try { obj.message = JSON.parse(obj.message); } catch (e) { }
        }
        res.status(200).json(obj);
    } catch (error) {
        console.error('Error fetching team member:', error);
        res.status(500).json({ error: 'Error fetching team member' });
    }
};

// Create team member
exports.createTeamMember = async (req, res) => {
    try {
        const { name, designation, type, email, telephoneNo, image, experience, academicDesignation, message, course, instaId, linkedinId, order } = req.body;
        const payload = {
            name,
            designation,
            type,
            email,
            telephoneNo,
            image,
            experience,
            academicDesignation,
            message,
            course,
            instaId,
            linkedinId,
            order: order || 0
        };
        // If message is array/object, stringify for TEXT column
        if (payload.message && typeof payload.message !== 'string') {
            payload.message = JSON.stringify(payload.message);
        }

        const teamMember = await TeamMember.create(payload);
        res.status(201).json(teamMember);
    } catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({ error: 'Error creating team member' });
    }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
    try {
        const { name, designation, type, email, telephoneNo, image, experience, academicDesignation, message, course, instaId, linkedinId, order, isActive } = req.body;
        const teamMember = await TeamMember.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        const updatePayload = {
            name: name || teamMember.name,
            designation: designation || teamMember.designation,
            type: type || teamMember.type,
            email: email || teamMember.email,
            telephoneNo: telephoneNo || teamMember.telephoneNo,
            image: image || teamMember.image,
            experience: experience || teamMember.experience,
            academicDesignation: academicDesignation || teamMember.academicDesignation,
            message: message !== undefined ? message : teamMember.message,
            course: course || teamMember.course,
            instaId: instaId || teamMember.instaId,
            linkedinId: linkedinId || teamMember.linkedinId,
            order: order !== undefined ? order : teamMember.order,
            isActive: isActive !== undefined ? isActive : teamMember.isActive
        };
        if (updatePayload.message && typeof updatePayload.message !== 'string') {
            updatePayload.message = JSON.stringify(updatePayload.message);
        }
        await teamMember.update(updatePayload);

        const obj = teamMember.toJSON();
        if (obj.message && typeof obj.message === 'string') {
            try { obj.message = JSON.parse(obj.message); } catch (e) { }
        }
        res.status(200).json(obj);
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ error: 'Error updating team member' });
    }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        await teamMember.destroy();
        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ error: 'Error deleting team member' });
    }
};
