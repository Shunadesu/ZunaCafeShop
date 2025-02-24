const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var oderSchema = new mongoose.Schema({
    product:[
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            count: Number,
        }
    ],
    status:{
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Cancelled', 'Successed']
    },
    paymentIntent: {},
    oderBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

//Export the model
module.exports = mongoose.model('Oder', oderSchema);