const Comment = require('../model/comments');
const User = require('../model/user');
const errors = require('../errors');
const {StatusCodes} = require('http-status-codes');

const getComments = async (req, res) => {
    const {id} = req.params
    const comment = await Comment.find({imageId:id})
    if (!comment) {
        throw new errors.NotFoundError(`Comment not found`)
    }
    return res.status(StatusCodes.OK).json({comments: comment})
}

const postComment = async (req, res) => {
    const {imageId, comment, userId, usersName} = req.body
    
    if (!imageId || !comment || !userId || !usersName) {
        throw new errors.BadRequestError(`Please provide all values`)
    }
    await Comment.create({...req.body, postedDate: new Date()});
    res.status(StatusCodes.OK).json({msg: `Comment has been posted successfully`});
}

module.exports = {
    getComments,
    postComment,
}