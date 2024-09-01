const Images = require('../model/images')
const cloudinary = require('cloudinary').v2
const {StatusCodes} = require('http-status-codes');
const fs = require('fs');
const errors = require('../errors');
const {extractPublicId} = require('cloudinary-build-url')


const uploadImage = async (req, res) => {
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
    console.log(name)
    if (!name) {
        console.log(!name)
        throw new errors.BadRequestError(`Please provide a name for this image`)
    }
    if (!imageValue) {
        throw new errors.BadRequestError(`Please upload an image`)
    }
    const image = await Images.create({...req.body, addedDate: new Date()});
    console.log(image.image)
    res.status(StatusCodes.OK).json({ image });
}

const getAllImages = async (req, res) => {
    const images = await Images.find({});
    if (!images) {
        throw new errors.NotFoundError(`No images found`)
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
    const { imageIds, imageURLs } = req.body;
    const getPublicIds = []

    try{
        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Images are required' });
        }
        imageURLs.forEach(element => {
            getPublicIds.push(extractPublicId(element))
        });

        const result = await Images.deleteMany({ _id: { $in: imageIds } });
        cloudinary.api.delete_resources(getPublicIds)
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