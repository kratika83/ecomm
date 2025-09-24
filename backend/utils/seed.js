// backend/seed.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import itemModel from './models/itemModel.js';
import userModel from './models/userModel.js';
import cartModel from './models/cartModel.js';

const MONGO = process.env.MONGO_URI;

const itemsSeed = [
    { title: 'Red Shirt', description: 'Comfortable red shirt', price: 20, category: 'Clothing', stock: 50 },
    { title: 'Blue Jeans', description: 'Classic jeans', price: 40, category: 'Clothing', stock: 30 },
    { title: 'Coffee Mug', description: 'Ceramic mug 300ml', price: 8, category: 'Home', stock: 120 },
    { title: 'Wireless Mouse', description: 'Ergonomic mouse', price: 25, category: 'Electronics', stock: 40 }
];

(async () => {
    try {
        await mongoose.connect(MONGO);
        await itemModel.deleteMany({});
        await userModel.deleteMany({});
        await cartModel.deleteMany({});

        const hashed = await bcrypt.hash('admin123', 10);
        const admin = await userModel.create({ name: 'Admin', email: 'admin@example.com', password: hashed, isAdmin: true });
        await cartModel.create({ user: admin._id, items: [] });

        await itemModel.insertMany(itemsSeed);
        console.log('Seed done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
