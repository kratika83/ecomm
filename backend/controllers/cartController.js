import { auth } from '../middlewares/auth.js';
import cartModel from '../models/cartModel.js';
import itemModel from '../models/itemModel.js';

// Get user's cart
const usersCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ user: req.user._id }).populate('items.item');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add item to cart (or increase qty)
const addToCart = async (req, res) => {
    try {
        const { itemId, qty = 1 } = req.body;
        const item = await itemModel.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) cart = await cartModel.create({ user: req.user._id, items: [] });

        const idx = cart.items.findIndex(i => i.item.toString() === itemId);
        if (idx > -1) cart.items[idx].qty += Number(qty);
        else cart.items.push({ item: itemId, qty: Number(qty) });

        await cart.save();
        await cart.populate('items.item');
        res.json(cart);
    } catch (err) {
        console.error(err); res.status(500).json({ message: 'Server error' });
    }
};

// Remove item
const removeCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(i => i.item.toString() !== itemId);
        console.log(cart, 'cart--');
        await cart.save();
        await cart.populate('items.item');
        res.json(cart);
    } catch (err) {
        console.error(err); res.status(500).json({ message: 'Server error' });
    }
};

// Update qty
const updateCart = async (req, res) => {
    try {
        const { itemId, qty } = req.body;
        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) cart = await cartModel.create({ user: req.user._id, items: [] });
        const idx = cart.items.findIndex(i => i.item.toString() === itemId);
        if (idx > -1) cart.items[idx].qty = Number(qty);
        else cart.items.push({ item: itemId, qty: Number(qty) });
        await cart.save();
        await cart.populate('items.item');
        res.json({ message: "Cart updated successfully" });
    } catch (err) {
        console.error(err); res.status(500).json({ message: 'Server error' });
    }
};

// Merge guest cart into user cart (call this after login with frontend local cart data)
const mergeCart = async (req, res) => {
    try {
        const { items = [] } = req.body; // items: [{ itemId, qty }]
        let cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) cart = await cartModel.create({ user: req.user._id, items: [] });

        for (const incoming of items) {
            if (!incoming.itemId) continue;
            const itemExists = cart.items.find(i => i.item && i.item.toString() === incoming.itemId);
            if (itemExists) itemExists.qty += Number(incoming.qty || 1);
            else cart.items.push({ item: incoming.itemId, qty: Number(incoming.qty || 1) });
        }

        await cart.save();
        await cart.populate('items.item');
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

let cartController = {
    usersCart: usersCart,
    addToCart: addToCart,
    removeCart: removeCart,
    updateCart: updateCart,
    mergeCart: mergeCart
};

export default cartController;