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
    // Kieu du lieu tham chieu
    const queries = {...req.query}
    // Tach cac truong du lieu dac biet ra khoi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el]) // o day co nghia la chi xoa nhung truong nay cuar queries thoi, con req.body thi van giu lai
    // Format Mongoose operators
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    const formattedQueries = JSON.parse(queryString);

    //Filttering
    if(queries?.title) formattedQueries.title = {$regex: queries.title, $options: 'i'} 
    // regax giup minh go tim thi chu can go 1 chu thoi thi van tim duoc 4 chu
    let queryCommand = Product.find(formattedQueries) // promise dang bendding ma thoi, chua goi
    
    //Sorting
    if(req.query.sort){
        // vd: abc,efg --> [abc, efc] --> abc efg
        const sortBy = req.query.sort.split(',').join(' ')
        // tu dau , chuyen thanh mang xong r join chuyen thanh dau space
        queryCommand = queryCommand.sort(sortBy)
    }else {
        queryCommand = queryCommand.sort('-createdAt'); // Default sorting
    }
    //fields limiting
    if (req.query.fields) {
        const fields = req.body.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    //pagnigation
    const page = parseInt(req.query.page) || 1; // phia client gui len
    const limit = parseInt(req.query.limit) || 4; // so phan tu object lay ve 1 lan goi api
    const skip = (page - 1) * limit; // bo qua 
    queryCommand = queryCommand.skip(skip).limit(limit);

    // So luong product thoa man dieu se khac voi so luong san pham tra ve 1 lan
    try {
        // execute the query
        const response = await queryCommand.exec();
        const counts = await Product.find(formattedQueries).countDocuments();
    
        return res.status(200).json({
            success: !!response,
            counts,
            products: response || 'Cannot get product',
            page,
            limit
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
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

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;

    if (!star || !pid) throw new Error('Missing inputs');

    const product = await Product.findById(pid);
    if (!product) throw new Error('Product not found');

    // Check if the user already rated the product
    const existingRatingIndex = product.ratings.findIndex(
        (el) => el.postedBy.toString() === _id.toString()
    );

    let updatedProduct;

    if (existingRatingIndex !== -1) {
        // Update existing rating
        product.ratings[existingRatingIndex].star = star;
        if (comment) product.ratings[existingRatingIndex].comment = comment;
        updatedProduct = await product.save();
    } else {
        // Add new rating
        updatedProduct = await Product.findByIdAndUpdate(
            pid,
            { $push: { ratings: { star, comment, postedBy: _id } } },
            { new: true }
        );
    }

    // Recalculate the average rating
    const totalStars = updatedProduct.ratings.reduce((sum, rating) => sum + rating.star, 0);
    updatedProduct.totalRatings = updatedProduct.ratings.length > 0 ? (totalStars / updatedProduct.ratings.length).toFixed(1) : 0;

    await updatedProduct.save();

    return res.status(200).json({
        success: true,
        message: 'Rating submitted successfully',
        product: updatedProduct,
    });
});

const uploadImagesProduct = asyncHandler(async(req, res) => {
    
    console.log(req.file)
    return res.json('Oke')
})


module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}