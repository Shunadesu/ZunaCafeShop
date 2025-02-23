const router = require('express').Router();
const ctrls = require('../controllers/blog')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.get('/one/:bid', ctrls.getBlog)
router.get('/', ctrls.getBlogs)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)


module.exports = router