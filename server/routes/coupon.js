const router = require('express').Router();
const ctrls = require('../controllers/coupon')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCoupon)
router.get('/one/:couponid', ctrls.getCoupon)
router.get('/', ctrls.getCoupons)
router.put('/:couponid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:couponid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)


module.exports = router


//Create -- Put --> body
// Get -- Delete --> query