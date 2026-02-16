const TeamMember = require('../model/teamMember');
const { Op } = require('sequelize');

// Get all messages by type (director, dean, counsellor, etc.)
exports.getMessagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const messages = await TeamMember.findAll({
            where: { type },
            order: [['order', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        // Fetch all TeamMembers that are likely to be "messages" (Director, Dean, etc.)
        // or just all TeamMembers if that's what's expected. 
        // Given the context of "Messages", it likely refers to the "Message from X" sections.
        const messages = await TeamMember.findAll({
            where: {
                type: {
                    [Op.in]: ['director', 'dean', 'counsellor', 'faculty_advisor']
                }
            },
            order: [['order', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Get message by id
exports.getMessageById = async (req, res) => {
    try {
        const message = await TeamMember.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Error fetching message' });
    }
};

// Create message
exports.createMessage = async (req, res) => {
    try {
        const { name, designation, image, messageContent, emailId, telephoneNo, type, order } = req.body;

        let messageArray = [];
        if (Array.isArray(messageContent)) {
            messageArray = messageContent;
        } else if (messageContent) {
            messageArray = [messageContent];
        }

        const message = await TeamMember.create({
            name,
            designation,
            image,
            message: messageArray,
            email: emailId,
            telephoneNo,
            type,
            order: order || 0
        });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Error creating message' });
    }
};

// Update message
exports.updateMessage = async (req, res) => {
    try {
        const { name, designation, image, messageContent, emailId, telephoneNo, type, order } = req.body;
        const message = await TeamMember.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        let messageArray = message.message;
        if (messageContent !== undefined) {
            if (Array.isArray(messageContent)) {
                messageArray = messageContent;
            } else if (messageContent) {
                messageArray = [messageContent];
            }
        }

        await message.update({
            name: name || message.name,
            designation: designation || message.designation,
            image: image || message.image,
            message: messageArray,
            email: emailId || message.email,
            telephoneNo: telephoneNo || message.telephoneNo,
            type: type || message.type,
            order: order !== undefined ? order : message.order
        });
        res.status(200).json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Error updating message' });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const message = await TeamMember.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        await message.destroy();
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Error deleting message' });
    }
};
