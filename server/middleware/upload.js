const multer = require('multer');
const path = require('path');

// Set storage engine
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type || 'Uncategorized';

        // Map types to folder names
        const folderMap = {
            "Anxiety": "Anxiety",
            "Anger": "Anger",
            "Habit": "habit",
            "Goals Setting": "motivation",
            "Stress": "stress",
            "Depression": "depression",
            "Internet Usage": "internetUsage",
            "Time-Management": "timeManagement",
            "Sleep and Body Image": "sleep"
        };

        const folderName = folderMap[type] || type; // Fallback to type if not in map

        // Construct path: server/middleware -> server -> root -> client/src...
        const dest = path.join(__dirname, '../../client/src/components/assets/BlogsPics', folderName);

        try {
            const logMsg = `[${new Date().toISOString()}] Type: ${type}, Folder: ${folderName}, Dest: ${dest}, Exists: ${fs.existsSync(dest)}\n`;
            fs.appendFileSync(path.join(__dirname, '../upload_debug.log'), logMsg);

            if (!fs.existsSync(dest)) {
                fs.appendFileSync(path.join(__dirname, '../upload_debug.log'), `Creating directory: ${dest}\n`);
                fs.mkdirSync(dest, { recursive: true });
            }
        } catch (err) {
            // ignore log errors
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('pic'); // 'pic' is the field name we expect

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload;
