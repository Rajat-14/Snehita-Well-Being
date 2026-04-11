const UsefulLink = require('../model/usefulLink');
const fs = require('fs');
const path = require('path');

exports.getUsefulLinks = async (req, res) => {
    try {
        const links = await UsefulLink.findAll({ order: [['createdAt', 'ASC']] });
        res.json(links);
    } catch (error) {
        console.error("Error fetching useful links:", error);
        res.status(500).json({ error: "Failed to fetch useful links" });
    }
};

exports.createUsefulLink = async (req, res) => {
    try {
        const { title, type, url } = req.body;
        const pic = req.file ? req.file.filename : null;

        const newLink = await UsefulLink.create({
            title,
            type,
            url,
            pic
        });

        res.status(201).json(newLink);
    } catch (error) {
        console.error("Error creating useful link:", error);
        res.status(500).json({ error: "Failed to create useful link" });
    }
};

exports.updateUsefulLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, url } = req.body;
        
        const link = await UsefulLink.findByPk(id);
        if (!link) {
            return res.status(404).json({ error: "Useful Link not found" });
        }

        let pic = link.pic;
        
        // If a new image is uploaded
        if (req.file) {
            pic = req.file.filename;
            
            // Delete old image
            if (link.pic) {
                const oldImagePath = path.join(__dirname, '../../client/src/components/assets/UsefullLinks', link.pic);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (err) {
                    console.error(`Error deleting old useful link image:`, err);
                }
            }
        }

        await link.update({ title, type, url, pic });
        res.json(link);
    } catch (error) {
        console.error("Error updating useful link:", error);
        res.status(500).json({ error: "Failed to update useful link" });
    }
};

exports.deleteUsefulLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await UsefulLink.findByPk(id);

        if (!link) {
            return res.status(404).json({ error: "Useful Link not found" });
        }

        // Delete associated physical image file if it exists
        if (link.pic) {
            const imagePath = path.join(__dirname, '../../client/src/components/assets/UsefullLinks', link.pic);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error(`Error deleting useful link image ${imagePath}:`, err);
            }
        }

        await link.destroy();
        res.json({ message: "Useful Link deleted successfully" });
    } catch (error) {
        console.error("Error deleting useful link:", error);
        res.status(500).json({ error: "Failed to delete useful link" });
    }
};
