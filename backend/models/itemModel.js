// backend/models/User.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        category: String,
        image: String,
        stock: {
            type: Number,
            default: 100
        }
    },
    {
        timestamps: true,
        collection: 'Items'
    }
);

const itemModel = mongoose.model('Items', itemSchema);

export default itemModel;