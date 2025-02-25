const router = require('express').Router();
const ctrls = require('../controllers/order')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createOrder)
router.get('/', ctrls.getUserOrder)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrder)
router.put('/status/:oid', [verifyAccessToken, isAdmin], ctrls.updateStatusOrder)
module.exports = router