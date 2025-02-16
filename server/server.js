const express = require('express'); //export express
require('dotenv').config();

    const app = express();
    const port = process.env.PORT || 8888;

app.use(express.json()); // read json file
app.use(express.urlencoded({extended: true})) // doc code nhieu kieu khac nhau 

app.use('/', (req, res) => {res.send('server on') })

app.listen(port, () => {
    console.log('server running onport: ', + port);
})