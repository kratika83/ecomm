import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            unique: true
        },
        items: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Items'
            },
            qty: {
                type: Number,
                default: 1
            }
        }]
    },
    {
        timestamps: true,
        collection: 'Carts'
    }
);

const cartModel = mongoose.model('Carts', cartSchema);

export default cartModel;