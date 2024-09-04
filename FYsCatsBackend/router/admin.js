const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/auth')
const {sendEmail, createAdmin, login, logout, forgotPassword, resetPassword, getRole} = require('../controller/admin');

router.route('/sendEmail').post(authMiddleware, sendEmail)
router.route('/register').post(authMiddleware, createAdmin)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)
router.route('/getRole').get(authMiddleware, getRole)

module.exports = router