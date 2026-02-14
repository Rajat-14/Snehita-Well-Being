const Message = require('../model/message');

// Get all messages by type (director, dean, counsellor, etc.)
exports.getMessagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const messages = await Message.findAll({
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
        const messages = await Message.findAll({
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
        const message = await Message.findByPk(req.params.id);
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
        const message = await Message.create({
            name,
            designation,
            image,
            messageContent,
            emailId,
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
        const message = await Message.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        await message.update({
            name: name || message.name,
            designation: designation || message.designation,
            image: image || message.image,
            messageContent: messageContent || message.messageContent,
            emailId: emailId || message.emailId,
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
        const message = await Message.findByPk(req.params.id);
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
