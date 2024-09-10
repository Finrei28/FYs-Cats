const { createJWT, verifyToken, cookiesToResponse } = require("./jwt");
const sendEmail = require("./sendEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const sendVerificationEmail = require("./sendVerificationEmail");
const hashString = require("./createHash");

module.exports = {
  createJWT,
  verifyToken,
  cookiesToResponse,
  sendEmail,
  sendResetPasswordEmail,
  hashString,
  sendVerificationEmail,
};
