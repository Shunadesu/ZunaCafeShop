const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            count: Number,
        }
    ],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Cancelled', 'Succeed']
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon',
    }
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Order', orderSchema);
