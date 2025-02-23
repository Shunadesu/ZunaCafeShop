const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createCoupon = asyncHandler(async(req, res)=>{
    const {name , discount, expires} = req.body
    if(!name || !discount || !expires) throw new Error('Missing inputs')
    const response = await Coupon.create({
        ...req.body,
        expires: Date.now() + +expires*24*60*60*1000
    })
    return res.status(200).json({
        success: response ? true : false,
        expires: expires,
        createdCoupon: response ? response : 'Cannot create new blog'
    })
})

const getCoupons = asyncHandler(async(req, res)=>{
    const response = await Coupon.find().select('name discount expires')
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot get all blog'
    })
})

const updateCoupon = asyncHandler(async(req, res)=>{
    const {couponid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if(req.body.expires) req.body.expires === Date.now() + +req.body.expires*24*60*60*1000
    const response = await Coupon.findByIdAndUpdate(couponid, req.body, {new: true})

    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update blog'
    })
})

const deleteCoupon = asyncHandler(async(req, res)=>{
    const {couponid} = req.params
    const deletedCoupon = await Coupon.findByIdAndDelete(couponid)

    return res.status(200).json({
        success: deletedCoupon ? true : false,
        deletedCoupon: deletedCoupon ? deletedCoupon : 'Cannot delete a blog'
    })
})


const getCoupon = asyncHandler(async(req, res)=>{
    const {couponid} = req.params
    const response = await Coupon.findById(couponid)
    return res.status(200).json({
        success: response ? true : false,
        getCoupon: response ? response : 'Cannot get blog'
    })
})

module.exports = { 
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}