const OrganizationInfo = require('../model/organizationInfo');

// Get all organization info by type (aboutUs, contactUs, snehita, etc.)
exports.getOrganizationInfoByType = async (req, res) => {
    try {
        const { type } = req.params;
        const info = await OrganizationInfo.findAll({
            where: { type },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(info);
    } catch (error) {
        console.error('Error fetching organization info:', error);
        res.status(500).json({ error: 'Error fetching organization info' });
    }
};

// Get all organization info
exports.getAllOrganizationInfo = async (req, res) => {
    try {
        const info = await OrganizationInfo.findAll();
        res.status(200).json(info);
    } catch (error) {
        console.error('Error fetching organization info:', error);
        res.status(500).json({ error: 'Error fetching organization info' });
    }
};

// Create organization info
exports.createOrganizationInfo = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const info = await OrganizationInfo.create({
            title,
            description,
            type
        });
        res.status(201).json(info);
    } catch (error) {
        console.error('Error creating organization info:', error);
        res.status(500).json({ error: 'Error creating organization info' });
    }
};

// Update organization info
exports.updateOrganizationInfo = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const info = await OrganizationInfo.findByPk(req.params.id);
        if (!info) {
            return res.status(404).json({ error: 'Organization info not found' });
        }
        await info.update({
            title: title || info.title,
            description: description || info.description,
            type: type || info.type
        });
        res.status(200).json(info);
    } catch (error) {
        console.error('Error updating organization info:', error);
        res.status(500).json({ error: 'Error updating organization info' });
    }
};

// Delete organization info
exports.deleteOrganizationInfo = async (req, res) => {
    try {
        const info = await OrganizationInfo.findByPk(req.params.id);
        if (!info) {
            return res.status(404).json({ error: 'Organization info not found' });
        }
        await info.destroy();
        res.status(200).json({ message: 'Organization info deleted successfully' });
    } catch (error) {
        console.error('Error deleting organization info:', error);
        res.status(500).json({ error: 'Error deleting organization info' });
    }
};
