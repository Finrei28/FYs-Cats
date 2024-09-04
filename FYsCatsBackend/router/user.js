const express = require('express')
const router = express.Router()
const { createUser, resendVerificationCode, registerVerification } = require('../controller/user')

router.route('/').post(createUser)
router.route('/resendVerificationCode').post(resendVerificationCode)
router.route('/registerVerification').post(registerVerification)

module.exports = router