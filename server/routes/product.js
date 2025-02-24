const router = require('express').Router();
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings', verifyAccessToken, ctrls.ratings)

// route nao can params thi nen de cuoi cung
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.single('images') ,ctrls.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)

router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/:pid', ctrls.getProduct)
module.exports = router


//Create -- Put --> body
// Get -- Delete --> query