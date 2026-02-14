const Achievement = require('../model/achievement');

// Get all active achievements
exports.getAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']]
        });
        res.status(200).json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Error fetching achievements' });
    }
};

// Get achievement by id
exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievement.findByPk(req.params.id);
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        res.status(200).json(achievement);
    } catch (error) {
        console.error('Error fetching achievement:', error);
        res.status(500).json({ error: 'Error fetching achievement' });
    }
};

// Create achievement
exports.createAchievement = async (req, res) => {
    try {
        const { title, description, image, order } = req.body;
        const achievement = await Achievement.create({
            title,
            description,
            image,
            order: order || 0
        });
        res.status(201).json(achievement);
    } catch (error) {
        console.error('Error creating achievement:', error);
        res.status(500).json({ error: 'Error creating achievement' });
    }
};

// Update achievement
exports.updateAchievement = async (req, res) => {
    try {
        const { title, description, image, order, isActive } = req.body;
        const achievement = await Achievement.findByPk(req.params.id);
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        await achievement.update({
            title: title || achievement.title,
            description: description || achievement.description,
            image: image || achievement.image,
            order: order !== undefined ? order : achievement.order,
            isActive: isActive !== undefined ? isActive : achievement.isActive
        });
        res.status(200).json(achievement);
    } catch (error) {
        console.error('Error updating achievement:', error);
        res.status(500).json({ error: 'Error updating achievement' });
    }
};

// Delete achievement
exports.deleteAchievement = async (req, res)=>{
    try {
        const achievement = await Achievement.findByPk(req.params.id);
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        await achievement.destroy();
        res.status(200).json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ error: 'Error deleting achievement' });
    }
};
