const router = require('express').Router();
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getProducts)

// route nao can params thi nen de cuoi cung
router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)
module.exports = router


//Create -- Put --> body
// Get -- Delete --> query