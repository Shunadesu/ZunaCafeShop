const User = require('../models/user')

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

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({sucess: false, message: req.body})
    }
    
    const response = await User.findOne({email})
    //check co email hay khong?
    if(response && await response.isCorrectPassword(password)) {

        const {password, role, ...userDate} = response.toObject()

        // check password thanh cong
        return res.status(200).json({
            success: true,
            userData
        })
    }else{
        throw new Error('Invalid password')
    }

})


module.exports = {
    register, 
    login,
}