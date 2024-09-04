const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
    },
    userName: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validator: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    createdAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    passwordToken: {
        type: String,
    },
    passwordTokenExpiryDate: {
        type: Date,
    },
})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (testpassword) {
    const isEqual = await bcrypt.compare(testpassword, this.password)
    return isEqual;
}

module.exports = mongoose.model('User', UserSchema);