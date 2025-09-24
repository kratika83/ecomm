import dotenv from 'dotenv';
dotenv.config();

import connect from './config/db.js';
connect();

import express from 'express';
const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

// Routes
import userRouter from './routes/userRouter.js';
app.use('/api/users/auth', userRouter);
import itemRouter from './routes/itemRouter.js';
app.use('/api/items', itemRouter);
import cartRouter from './routes/cartRouter.js';
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));