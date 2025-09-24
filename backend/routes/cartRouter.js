import cartController from '../controllers/cartController.js';
import { auth } from '../middlewares/auth.js';
import express from 'express';
const cartRouter = express.Router();

cartRouter.get(
    '/',
    auth,
    cartController.usersCart
);

cartRouter.post(
    '/add',
    auth,
    cartController.addToCart
);

cartRouter.post(
    '/remove',
    auth,
    cartController.removeCart
);

cartRouter.post(
    '/update',
    auth,
    cartController.updateCart
);

cartRouter.post(
    '/merge',
    auth,
    cartController.mergeCart
);

export default cartRouter;