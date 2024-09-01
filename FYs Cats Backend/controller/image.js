const Images = require('../model/images')
const cloudinary = require('cloudinary').v2
const {StatusCodes} = require('http-status-codes');
const fs = require('fs');
const errors = require('../errors');

const uploadImage = async (req, res) => {
    console.log(req.files)
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true, folder: 'FYs-Cats'
    })

    const optimizeUrl = cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({image:{src: result.secure_url}})
}

const saveImage = async (req, res) => {
    const { name, image:imageValue } = req.body;
    if (!name) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: `Please provide a name for this image`})
    }
    if (!imageValue) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: `Please upload an image`})
    }
    const image = await Images.create({...req.body, addedDate: new Date()});
    res.status(StatusCodes.OK).json({ image });
}

const getAllImages = async (req, res) => {
    const images = await Images.find({});
    if (!images) {
        return res.status(StatusCodes.NOT_FOUND).json({images: 0})
    }
    res.status(StatusCodes.OK).json( {images: images});
}

const getImage = async (req, res) => {
    const image = await Images.findById(req.params.id)
    if (!image) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Image could not be found`})
    }
    res.status(StatusCodes.OK).json({image})
}

const deleteImage = async (req, res) => {
    const { imageIds } = req.body;
    try{
        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Image IDs are required' });
        }
        const result = await Images.deleteMany({ _id: { $in: imageIds } });
        if (result.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No images were found to delete' });
        }
        
        res.status(StatusCodes.OK).json({ msg: `${result.deletedCount} images deleted successfully` })
    }
  
     catch (error) {
        console.error('Error deleting images:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'An error occurred while deleting images' });
      }
    };

const updateImage = async (req, res) => {
    const {id} = req.params
    const image = await Images.findOneAndUpdate({_id:id}, req.body, {
        new:true,
        runValidators:true,
    })
    if (!image) {
        throw new errors.NotFoundError(`Image not found`)
    }
    res.status(StatusCodes.OK).json({msg: `Updated Successfully`})

}


module.exports = {
    uploadImage,
    saveImage,
    getAllImages,
    getImage,
    deleteImage,
    updateImage,
}