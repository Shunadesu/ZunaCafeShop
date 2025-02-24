const router = require('express').Router();
const ctrls = require('../controllers/order')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createOrder)

module.exports = router