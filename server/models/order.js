const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            count: { type: Number, required: true },
        }
    ],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Cancelled', 'Succeeded']
    },
    paymentIntent: {}, // Store payment details if needed
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Order', orderSchema);
