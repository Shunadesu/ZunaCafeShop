const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')
const asyncHandler = require('express-async-handler')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')

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
        const {password, role, refreshToken,...userData} = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id) // check qua han toke
        // Save refresToken vao database
        await User.findByIdAndUpdate(response._id, {newRefreshToken}, {new: true})
        // Luu refreshToken vao cookie
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, maxAge: 7 * 60 * 60 * 24 * 1000})

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
    const user = await User.findById(_id).select('-refreshToken -password ') // Tim xem email duoc dang ky hay chua
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })

})

const refreshAccessToken = asyncHandler(async(req, res) => {
    // Lay token tu cookies
    const cookie = req.cookies

    //check xem co token hay khong
    if(!cookie && !cookie.refreshToken) throw Error('No refresh token in cookies')
    //check token con han hay khong
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    // Check xem token co khop voi token da luu trong db hay khong
    const response = await User.findOne({_id: rs._id, refreshToken: cookie.refreshToken})
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'RefreshToken not matched'
    })
})

const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('No refreshToken in Cookie')
    // Xoa cai refreshToken o db
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''} , {new: true})
    // Xoa refresh token o cookie trinh duyet
    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout successfully'
    })
})

// Reset password
// Client gui mail ma ho dang ki --> server check xem mail co hop le khong --> hop le gui mail cho nguoi ta ke theo link (password token)
// --> Bao cho phia client check mail --> click vao link minh gui
// Client se gui API kem theo Token 
// Server check xem token co giong token minh gui qua mail khong, neu giong cho nguoi ta thay doi.!

//Ham check mail

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler( async (req, res )=> {
    const response = await User.find().select('-refreshToken -password ')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

const deleteUser = asyncHandler( async (req, res )=> {
    const {_id} = req.query
    if(!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email}` : 'No User Delete'
    })
})

//Object keys chuyen tu object --> mang, neu length cua object = 0 nghia la Object do rong
const updateUser = asyncHandler(async (req, res) => {

    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

// const updateUserAddress = asyncHandler(async (req, res) => {
//     const { _id } = req.user
//     if (!req.body.address) throw new Error('Missing inputs')
//     const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}}, { new: true }).select('-password -role -refreshToken')
//     return res.status(200).json({
//         success: response ? true : false,
//         updatedUser: response ? response : 'Some thing went wrong'
//     })
// })

//gpt coding
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { address } = req.body;

    if (!address) throw new Error('Missing inputs');

    // Find the user first
    const user = await User.findById(_id).select('address');
    if (!user) throw new Error('User not found');

    // Check if the address already exists
    if (user.address.includes(address)) {
        // Remove the existing duplicate before adding the new one
        await User.findByIdAndUpdate(_id, { $pull: { address: address } });
    }

    // Push the new address
    const response = await User.findByIdAndUpdate(
        _id,
        { $push: { address: address } },
        { new: true }
    ).select('-password -role -refreshToken');

    return res.status(200).json({
        success: !!response,
        updatedUser: response || 'Something went wrong'
    });
});


const updateUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const {pid, quantity} = req.body
    if (!pid || !quantity) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    console.log(user)

    if(alreadyProduct){
        const response = await User.updateOne({cart: {$elemMatch: alreadyProduct}}, {$set: {"cart.$.quantity": quantity}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            Cart: response ? response : 'Some thing went wrong'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity}}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            Cart: response ? response : 'Some thing went wrong'
        })
    }
})


module.exports = {
    register, 
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateUserCart
}