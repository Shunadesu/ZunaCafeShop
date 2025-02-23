const ProductCategory = require('../models/productCategory')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const slugify = require('slugify')

const createCategory = asyncHandler(async(req, res) => {
    const response = await ProductCategory.create(req.body)

    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not create new Product Category'
    })
})

const getCategories = asyncHandler(async(req, res) => {
    const response = await ProductCategory.find().select('title _id')

    return res.json({
        success: response ? true : false,
        productCategories: response ? response : 'Can not get Product Category'
    })
})

const updateCategory = asyncHandler(async(req, res) => {
    const { pcid } = req.params
    if (!pcid) {
        return res.status(400).json({ success: false, message: "Category ID is required" });
    }
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {new: true} )
    console.log(response)
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Can not update Product Category'
    })
})

const deleteCategory = asyncHandler(async(req, res) => {
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)

    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Can not deleted Product Category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}