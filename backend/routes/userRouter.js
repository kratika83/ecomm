import userController from '../controllers/userController.js';
import express from 'express';
const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

export default userRouter;