const jwt = require('jsonwebtoken')

const asyncHandler = require ('express-async-handler')

const verifyAccessToken = asyncHandler(async(req, res, next) => {
    // Token thuong bat dau = chu bearer (dung de phan quyen)
    // Bearer token

    //Headers: {authorization: 'Bearer token}
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1] // tao mang lay phan tu thu 2
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err) return res.status(401).json({
                succes: false,
                mes: 'Invalid Web Token'
            })

            console.log(decode)
            req.user = decode
            next()
        })
    }else{
        return res.status(401).json({
            succes: false,
            mes: 'Require Authentication!!'
        })
    }
})

module.exports = {
    verifyAccessToken
}