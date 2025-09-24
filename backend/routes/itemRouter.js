import itemController from '../controllers/itemCOntroller.js';
import { auth, admin } from '../middlewares/auth.js';
import express from 'express';
const itemRouter = express.Router();

itemRouter.post(
    '/',
    auth, admin,
    itemController.createItem
);

itemRouter.get('/', itemController.itemList);
itemRouter.get('/:id', itemController.item);

itemRouter.put(
    '/:id',
    auth, admin,
    itemController.updateItem
);

itemRouter.delete(
    '/:id',
    auth, admin,
    itemController.updateItem
);

export default itemRouter;