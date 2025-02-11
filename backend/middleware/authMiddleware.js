const jwt = require('jsonwebtoken');
const User = require('../models/User');
function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, email: decoded.email };
        console.log("Decoded user:", decoded);
        next();
    } catch (err) {
        console.error("Invalid token:", err);
        res.status(400).json({ error: 'Invalid token' });
    }
}

module.exports = authenticate;