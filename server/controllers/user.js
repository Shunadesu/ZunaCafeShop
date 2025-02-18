const User = require('../models/user')
const {generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')

const asyncHandler = require('express-async-handler')

const register = asyncHandler(async(req, res) => {
    const {email, password, name} = req.body

    if (!email || !password || !name) {
        return res.status(400).json({sucess: false, message:"Missing inputs"})
    }

    const user = await User.findOne({email: email}) // Tim xem email duoc dang ky hay chua
    if (user) throw new Error('User has existed already')
    else {
            const newUser = await User.create(req.body)
            return res.status(200).json({
                success: newUser ? true : false,
                mes: newUser ? 'Register successfully, Please login' : 'Something went wrong' 
            })
        }
})
// Chuc nang cua refresh chi dung de cap moi 1 cai accessToken

//AccessToken giup xac thuc nguoi dung, phan quyen nguoi dung
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({sucess: false, message: req.body})
    }
    
    const response = await User.findOne({email})
    //check co email hay khong?
    if(response && await response.isCorrectPassword(password)) {

        // Tach password va role ra khoi respone
        const {password, role, ...userData} = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const refreshToken = generateRefreshToken(response._id) // check qua han toke
        // Save refresToken vao database
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new: true})
        // Luu refreshToken vao cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 60 * 60 * 24 * 1000})

        // check password thanh cong
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }else{
        throw new Error('Invalid password')
    }

})

const getCurrent = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role') // Tim xem email duoc dang ky hay chua
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })

})



module.exports = {
    register, 
    login,
    getCurrent,
}