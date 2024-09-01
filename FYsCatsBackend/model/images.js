
const mongoose = require('mongoose');


const ImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    addedDate: {
        type: Date,
        required:true,
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Image', ImageSchema);