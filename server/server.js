const express = require('express'); //export express
require('dotenv').config();

const dbConnect = require('./config/dbConnect') // connect mongoose
const initRoutes = require('./routes')
    const app = express();
    const port = process.env.PORT || 8888;

const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET' ,'DELETE']
}))
app.use(express.json()); // read json file
app.use(express.urlencoded({extended: true})) // doc code nhieu kieu khac nhau 

dbConnect()
initRoutes(app)

app.use('/', (req, res) => {res.send('server on') })

app.listen(port, () => {
    console.log('server running onport: ', + port);
})