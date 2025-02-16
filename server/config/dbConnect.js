const { default: mongoose } = require('mongoose')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOOSE_URI)
        if(conn.connection.readyState == 1) console.log('db connect successfully')
            else console.log('db connect checking') 
    } catch (error) {
        console.log('db connect fail')
        throw new Error(error)
    }
}

module.exports = dbConnect