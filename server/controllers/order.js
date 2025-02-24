const Order = require('../models/order');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {

    const {_id} = req.user
    const userCart = await User.findById(_id).select('cart')
    // const { products, orderedBy, totalPrice } = req.body;

    // if (!products || !orderedBy || !totalPrice) throw new Error('Missing inputs');

    // const response = await Order.create(req.body);

    return res.status(201).json({
        success: userCart ? true : false,
        createdOrder: userCart ? userCart : 'Cannot create order'
    });
});

module.exports = {
    createOrder
};