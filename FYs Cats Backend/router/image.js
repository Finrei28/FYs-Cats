const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/auth')
const {saveImage, uploadImage, getAllImages, getImage, deleteImage, updateImage} = require('../controller/image')

router.route('/uploadImage').post(authMiddleware, uploadImage);
router.route('/saveImage').post(authMiddleware, saveImage);
router.route('/').get(getAllImages);
router.route('/:id').get(getImage).delete(authMiddleware, deleteImage).patch(authMiddleware, updateImage);

module.exports = router