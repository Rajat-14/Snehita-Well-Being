const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;

        if (!token) {
            return res.status(401).json({ message: "Not authorized. No token found." });
        }

        const decoded = jwt.verify(token, "abcdef");

        if (decoded.role === 'admin') {
            req.user = decoded; // Contains id: 0, role: 'admin'
            return next();
        } else {
            return res.status(403).json({ message: "Access forbidden. Admin role required." });
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Not authorized. Token verification failed." });
    }
};

module.exports = isAdmin;
