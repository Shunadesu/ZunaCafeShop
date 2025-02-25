const Order = require('../models/order');
const Coupon = require('../models/coupon');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.product.quantity
    }))

    let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum , 0)

    const createData = {products, total, orderBy: _id}

    if(coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon?.discount/100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const rs = await Order.create(createData)
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    });
});

const updateStatusOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if(!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true}) 
    return res.status(201).json({
        success: response ? true : false,
        updateStatus: response ? response : 'Something went wrong'
    });
});

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({orderBy: _id}) 
    return res.status(201).json({
        success: response ? true : false,
        updateStatus: response ? response : 'Something went wrong'
    });
});

const getOrder = asyncHandler(async (req, res) => {
    const limit = 2
    const { page } = req.query;
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
        .skip((page - 1) * limit) // Skip previous pages
        .limit(Number(limit)) // Limit results per page
        .populate({
            path: 'orderBy',
            select: 'name email', // Select user fields
        })
        .populate({
            path: 'products.product',
            select: 'title price', // Select product fields
        });
    return res.status(201).json({
        success: orders ? true : false,
        totalOrders: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: Number(page),
        updateStatus: orders ? orders : 'Something went wrong'
    });
});

module.exports = {
    createOrder,
    updateStatusOrder,
    getUserOrder,
    getOrder
};