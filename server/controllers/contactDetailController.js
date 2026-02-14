const ContactDetail = require('../model/contactDetail');

// Get all contact details
exports.getAllContactDetails = async (req, res) => {
    try {
        const contacts = await ContactDetail.findAll({
            where: { isActive: true }
        });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contact details:', error);
        res.status(500).json({ error: 'Error fetching contact details' });
    }
};

// Get contact detail by id
exports.getContactDetailById = async (req, res) => {
    try {
        const contact = await ContactDetail.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact detail not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact detail:', error);
        res.status(500).json({ error: 'Error fetching contact detail' });
    }
};

// Create contact detail
exports.createContactDetail = async (req, res) => {
    try {
        const { location, addressLine1, addressLine2, addressLine3, city, state, country, postalCode, email, mapsLink } = req.body;
        const contact = await ContactDetail.create({
            location,
            addressLine1,
            addressLine2,
            addressLine3,
            city,
            state,
            country,
            postalCode,
            email,
            mapsLink
        });
        res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact detail:', error);
        res.status(500).json({ error: 'Error creating contact detail' });
    }
};

// Update contact detail
exports.updateContactDetail = async (req, res) => {
    try {
        const { location, addressLine1, addressLine2, addressLine3, city, state, country, postalCode, email, mapsLink, isActive } = req.body;
        const contact = await ContactDetail.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact detail not found' });
        }
        await contact.update({
            location: location || contact.location,
            addressLine1: addressLine1 || contact.addressLine1,
            addressLine2: addressLine2 || contact.addressLine2,
            addressLine3: addressLine3 || contact.addressLine3,
            city: city || contact.city,
            state: state || contact.state,
            country: country || contact.country,
            postalCode: postalCode || contact.postalCode,
            email: email || contact.email,
            mapsLink: mapsLink || contact.mapsLink,
            isActive: isActive !== undefined ? isActive : contact.isActive
        });
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error updating contact detail:', error);
        res.status(500).json({ error: 'Error updating contact detail' });
    }
};

// Delete contact detail
exports.deleteContactDetail = async (req, res) => {
    try {
        const contact = await ContactDetail.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact detail not found' });
        }
        await contact.destroy();
        res.status(200).json({ message: 'Contact detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact detail:', error);
        res.status(500).json({ error: 'Error deleting contact detail' });
    }
};
