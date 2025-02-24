const userRouter = require('./user')
const productRouter = require('./product')
const blogRouter = require('./blog')
const couponRouter = require('./coupon')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')

const cors = require('cors');

const {errorHandler, notFound} = require('../middlewares/errorhandler')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/coupon', couponRouter)
    app.use('/api/productcategory', productCategoryRouter)
    app.use('/api/blogcategory', blogCategoryRouter)
    app.use('/api/blog', blogRouter)


    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes