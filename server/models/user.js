const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model

const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        min: 1 
    },
    price: { 
        type: Number, 
    },
    total: { 
        type: Number, 
    }
}, { _id: false });

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: 'user',
    },
    cart: [cartItemSchema],
    address: String,
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt:{
        type: String
    },
    passwordResetToken:{
        type: String
    },
    passwordResetExpires:{
        type: String
    },

},
    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
}) // khong ap dung cho hang update

userSchema.methods = {
    // ham compare so sanh password
    isCorrectPassword: async function (password) {
        // ham se tra ve true of false
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function(){
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    } 
}


//Export the model
module.exports = mongoose.model('User', userSchema);