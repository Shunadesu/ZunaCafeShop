const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.create(req.body)

    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not create new Blog Category'
    })
})

const getCategories = asyncHandler(async(req, res) => {
    const response = await BlogCategory.find().select('title _id')

    return res.json({
        success: response ? true : false,
        productCategories: response ? response : 'Can not get Blog Category'
    })
})

const updateCategory = asyncHandler(async(req, res) => {
    const { bcid } = req.params
    if (!bcid) {
        return res.status(400).json({ success: false, message: "Category ID is required" });
    }
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new: true} )
    console.log(response)
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Can not update Blog Category'
    })
})

const deleteCategory = asyncHandler(async(req, res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)

    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Can not deleted Blog Category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}