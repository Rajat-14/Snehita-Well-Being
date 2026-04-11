const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../../client/src/components/assets/UsefullLinks');

        try {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
        } catch (err) {
            console.error("Error creating destination folder:", err);
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, 'usefullink-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadUsefulLink = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('pic');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = uploadUsefulLink;
