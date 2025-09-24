import itemModel from '../models/itemModel.js';

// Create (admin)
const createItem = async (req, res) => {
    try {
        const item = await itemModel.create(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Read list with filters e.g. ?category=Clothes&minPrice=10&maxPrice=100&q=shirt&sort=price_asc&page=1&limit=12
const itemList = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, q, sort, page = 1, limit = 12 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (q) filter.title = { $regex: q, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const skip = (Number(page) - 1) * Number(limit);
        let query = itemModel.find(filter).skip(skip).limit(Number(limit));
        if (sort === 'price_asc') query = query.sort({ price: 1 });
        else if (sort === 'price_desc') query = query.sort({ price: -1 });
        const items = await query.exec();
        res.json(items);
    } catch (err) {
        console.error(err); res.status(500).json({ message: 'Server error' });
    }
};

// Read single
const item = async (req, res) => {
    try {
        const item = await itemModel.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update (admin)
const updateItem = async (req, res) => {
    try {
        const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Item Updated Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete (admin)
const deleteItem = async (req, res) => {
    try {
        await itemModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

let itemController = {
    createItem: createItem,
    itemList: itemList,
    item: item,
    updateItem: updateItem,
    deleteItem: deleteItem
}

export default itemController;