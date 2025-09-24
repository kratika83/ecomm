import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import cartModel from '../models/cartModel.js';

// register
const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already used' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashedPassword, isAdmin: !!isAdmin });

        // ensure an empty cart is created for the user
        await cartModel.findOneAndUpdate({ user: user._id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

        res.json({ user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // send user and cart so frontend can immediately use cart
        let cart = await cartModel.findOne({ user: user._id }).populate('items.item');
        if (!cart) cart = await cartModel.create({ user: user._id, items: [] });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
            cart
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

let userController = {
    register: register,
    login: login
};

export default userController;