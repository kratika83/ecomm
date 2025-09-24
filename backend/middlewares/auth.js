// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import userModel from './../models/userModel.js';

export const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || req.headers.Authorization;
        if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) next();
    else res.status(403).json({ message: 'Require admin' });
};
