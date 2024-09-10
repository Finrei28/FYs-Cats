const User = require("../model/user");
const errors = require("../errors");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils");

const verificationCodes = {};

const createUser = async (req, res) => {
  const { userName, password, name, email } = req.body;
  if (!userName || !password || !name || !email) {
    throw new errors.BadRequestError(`Please fill in all fields`);
  }
  const checkUser = await User.findOne({ userName });
  if (checkUser) {
    throw new errors.BadRequestError(`Username has already been taken`);
  }
  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    throw new errors.BadRequestError(
      `Seems like you already have an account with us with that email`,
    );
  }
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  verificationCodes[userName] = verificationCode;
  sendVerificationEmail({ email, verificationCode });
  await User.create({ ...req.body, createdAt: new Date() });
  return res.status(StatusCodes.OK).json({ msg: `Account has been created` });
};

const resendVerificationCode = async (req, res) => {
  const { userName } = req.body;
  const user = await User.findOne({ userName });
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  verificationCodes[userName] = verificationCode;
  sendVerificationEmail({ email: user.email, verificationCode });
  res.status(StatusCodes.OK).json({ msg: "Email Resent" });
};

const registerVerification = async (req, res) => {
  const { userName, verificationCode } = req.body;
  if (!verificationCode) {
    throw new errors.BadRequestError(
      "Please enter your verification code sent to your email",
    );
  }

  const code = verificationCodes[userName];
  if (code !== verificationCode) {
    throw new errors.UnauthenticatedError("Invalid verification code");
  }
  await User.findOneAndUpdate({ userName: userName }, { isVerified: true });
  delete verificationCodes[userName];
  res.status(StatusCodes.OK).json({ msg: "Account verified" });
};

module.exports = {
  createUser,
  resendVerificationCode,
  registerVerification,
};
