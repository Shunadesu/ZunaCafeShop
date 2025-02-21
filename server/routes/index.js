const userRouter = require('./user')
const productRouter = require('./product')

const {errorHandler, notFound} = require('../middlewares/errorhandler')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    
    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes