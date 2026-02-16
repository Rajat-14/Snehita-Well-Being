const Counselor = require('../model/counselor');

// Get all counselors
exports.getAllCounselors = async (req, res) => {
    try {
        const counselors = await Counselor.findAll({
            attributes: ['id', 'name', 'email'] // Fetch necessary fields
        });
        res.status(200).json(counselors);
    } catch (error) {
        console.error('Error fetching counselors:', error);
        res.status(500).json({ error: 'Error fetching counselors' });
    }
};
