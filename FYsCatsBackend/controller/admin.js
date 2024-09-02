const Admin = require('../model/admin');
const errors = require('../errors');
const { cookiesToResponse, sendEmail, sendResetPasswordEmail, hashString, verifyToken } = require('../utils');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');


const createAdmin = async (req, res) => {
    const {userName, password, email, name} = req.body
    if (!userName | !password | !email | !name) {
        throw new errors.BadRequestError('Please provide all fields')
    }
    const checkUserName = await Admin.findOne({ userName:userName });
    const checkEmail = await Admin.findOne({ email:email });
    if (checkUserName) {
        throw new errors.BadRequestError('This username already exists')
    }
    if (checkEmail) {
        throw new errors.BadRequestError('This email already exists')
    }

    await Admin.create({userName, password, email, name})
    res.status(StatusCodes.OK).json({msg: "Account has been created"})
}

const login = async (req, res) => {
    const {userName, password} = req.body;
    if (!userName | !password) {
        throw new errors.BadRequestError('Please provide username or password');
    }

    const checkAdmin = await Admin.findOne({ userName: userName});
    if (!checkAdmin) {
        throw new errors.UnauthenticatedError('Incorrect username or password');
    }

    const checkPassword = await checkAdmin.comparePassword(password);
    
    if (!checkPassword) {
        throw new errors.UnauthenticatedError('Incorrect username or password')
    }

    const admin = {adminID: checkAdmin._id, userName: checkAdmin.userName, role: checkAdmin.role, name:checkAdmin.name}
    cookiesToResponse({ res, admin: admin })
    res.status(StatusCodes.OK).json({admin:admin})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
        secure: true,
        sameSite: 'none'
    });
    res.status(StatusCodes.OK).json('logged out successfully')
}

const getRole = async (req, res) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new errors.UnauthenticatedError(`Unauthenticated to access`)
    }
    const admin = verifyToken({token})
    res.status(StatusCodes.OK).json({role: admin.role})
}



    const forgotPassword = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            throw new errors.BadRequestError('Please provide a valid email');
        }
        const admin = await Admin.findOne({ email });
        if (admin) {
            const passwordToken = crypto.randomBytes(70).toString('hex');
            
            sendResetPasswordEmail({email: email, token: passwordToken})
            const thirtyMinutes = 1000 * 60 * 30;
            const passwordTokenExpiryDate = new Date(Date.now() + thirtyMinutes);
            
            admin.passwordToken = hashString(passwordToken);
            admin.passwordTokenExpiryDate = passwordTokenExpiryDate;
            await admin.save();
        }

        res.status(StatusCodes.OK).json({msg: "We've sent you a password reset to your email"})
    }

    const resetPassword = async (req, res) => {
        const { token, email, password }  = req.body;

        if (!token || !email || !password ) {
            throw new errors.BadRequestError('Values missing')
        }
        if (password.length < 8) {
            throw new errors.BadRequestError('Password needs to be at least 8 characters long')
        }
        const admin = await Admin.findOne({email});
        if (admin) {
            const today = new Date();
            if (admin.passwordToken === hashString(token) && admin.passwordTokenExpiryDate > today) {
                admin.password = password;
                admin.passwordToken = null;
                admin.passwordTokenExpiryDate = null;
                await admin.save();
            }

        }
        res.status(StatusCodes.OK).json({msg: 'Password changed'})
    }

module.exports = {
    sendEmail,
    createAdmin,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getRole,
}