const Admin = require('../model/admin');
const User = require('../model/user')
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
    const checkUser = await User.findOne({userName})
    let user = {}
    if (!checkUser) {
        if (!checkAdmin) {
            throw new errors.UnauthenticatedError('Incorrect username or password');
        }

        const checkAdminPassword = await checkAdmin.comparePassword(password);
        if (!checkAdminPassword) {
            throw new errors.UnauthenticatedError('Incorrect username or password')
        }
        user = {userId: checkAdmin._id, userName: checkAdmin.userName, role: checkAdmin.role, name:checkAdmin.name}
        console.log("admin")
    }

    const checkUserPassword = await checkUser.comparePassword(password);
    
    if (!checkUserPassword) {
        throw new errors.UnauthenticatedError('Incorrect username or password')
    }
    user = {userId: checkUser._id, userName: checkUser.userName, role: 'user', name:checkUser.name}
    console.log("user")
    cookiesToResponse({ res, user: user })
    res.status(StatusCodes.OK).json({user: user})
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
    const user = verifyToken({token})
    res.status(StatusCodes.OK).json({role: user.role})
}



    const forgotPassword = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            throw new errors.BadRequestError('Please provide a valid email');
        }
        const admin = await Admin.findOne({ email });
        const user = await User.findOne({ email });
        if (user || admin) {
            const passwordToken = crypto.randomBytes(70).toString('hex');
                
            sendResetPasswordEmail({email: email, token: passwordToken})
            const thirtyMinutes = 1000 * 60 * 30;
            const passwordTokenExpiryDate = new Date(Date.now() + thirtyMinutes);
            if (admin) {
                admin.passwordToken = hashString(passwordToken);
                admin.passwordTokenExpiryDate = passwordTokenExpiryDate;
                await admin.save();
            }
            else {
                user.passwordToken = hashString(passwordToken);
                user.passwordTokenExpiryDate = passwordTokenExpiryDate;
                await user.save();
            }

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
        const user = await User.findOne({ email });
        const today = new Date();
        if (admin) {
            if (admin.passwordToken === hashString(token) && admin.passwordTokenExpiryDate > today) {
                admin.password = password;
                admin.passwordToken = null;
                admin.passwordTokenExpiryDate = null;
                await admin.save();
            }
        }
        else if (user) {
            if (user.passwordToken === hashString(token) && user.passwordTokenExpiryDate > today) {
                user.password = password;
                user.passwordToken = null;
                user.passwordTokenExpiryDate = null;
                await user.save();
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