const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async(req, res)=>{
    const {title , description, category} = req.body
    if(!title || !description || !category) throw new Error('Missing inputs')
    const response = await Blog.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})

const getBlogs = asyncHandler(async(req, res)=>{
    const response = await Blog.find().select('title category description author')
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot get all blog'
    })
})

const updateBlog = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true})

    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update blog'
    })
})

const deleteBlog = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    const deletedBlog = await Blog.findByIdAndDelete(bid)

    return res.status(200).json({
        success: deletedBlog ? true : false,
        deletedBlog: deletedBlog ? deletedBlog : 'Cannot delete a blog'
    })
})


const getBlog = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    const response = await Blog.findById(bid)
    return res.status(200).json({
        success: response ? true : false,
        getBlog: response ? response : 'Cannot get blog'
    })
})

const uploadImagesBlog = asyncHandler(async(req, res) => {
    const {bid} = req.params
    if(!req.file) throw new Error('Missing files');
    const response = await Blog.findByIdAndUpdate(bid, {image: req.file.path}, {new: true})

    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : 'Something went wrong'
    })
})

module.exports = { 
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    uploadImagesBlog
}