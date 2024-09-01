const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/auth')
const {sendEmail, createAdmin, login, logout, registerVerification, forgotPassword, resetPassword, resendVerificationCode, getRole} = require('../controller/admin');

router.route('/sendEmail').post(authMiddleware, sendEmail)
router.route('/register').post(createAdmin)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/verification').post(registerVerification)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)
router.route('/resendVerificationCode').post(resendVerificationCode)
router.route('/getRole').get(getRole)

module.exports = router