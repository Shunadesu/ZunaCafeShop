const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
// Declare the Schema of the Mongo model
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
    cart: {
        type: Array,
        default: [],
    },
    address: [{type: mongoose.Types.ObjectId, ref: 'Address'}],
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
    }
},
    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
}) // khong ap dung cho hang update

//Export the model
module.exports = mongoose.model('User', userSchema);