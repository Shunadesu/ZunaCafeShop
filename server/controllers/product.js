const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const slugify = require('slugify')

const createProduct = asyncHandler(async(req, res)=>{
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')

    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
//Lay 1 product
const getProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    const product = await Product.findById(pid) 
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

//Lay all product -- filtering, sorting and pagination
const getProducts = asyncHandler(async(req, res)=>{
    const products = await Product.find() 
    return res.status(200).json({
        success: products ? true : false,
        productData: products ? products : 'Cannot get product'
    })
})


const updateProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true}) 
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update a product'
    })
})

const deleteProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid) 
    return res.status(200).json({
        success: deleteProduct ? true : false,
        updatedProduct: deleteProduct ? deleteProduct : 'Cannot delete a product'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}