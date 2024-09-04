const { date } = require('joi');
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    imageId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
    },
    usersName: {
        type: String,
        required: true,
    },
    postedDate: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('Comment', CommentSchema);