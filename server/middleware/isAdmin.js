const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.SECRET || 'abcdef';

/**
 * Middleware that checks for a valid admin JWT token in cookies.
 * Attach to any route that requires admin privileges.
 */
const isAdmin = (req, res, next) => {
    const token = req.cookies.admintoken;

    if (!token) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Admin token error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired admin session' });
    }
};

module.exports = isAdmin;
