const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    };
};
