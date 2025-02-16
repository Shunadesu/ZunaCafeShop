const notFound = (req, res, next) => { 
    // Route mà người dùng không tìm thấy 
    const error = new Error(`Route ${req.originalUrl} not found`)
    res.status(404)
    next(error)
}

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode 
    return res.status(statusCode).json({
        sucess: false,
        mes: error.message,
    })
}

module.exports = {
    notFound,
    errorHandler
}