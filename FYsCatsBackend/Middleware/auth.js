const { UnauthenticatedError, UnauthorizedError } = require('../errors/index');
const { verifyToken } = require('../utils/index');

const authMiddleware = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
      throw new UnauthenticatedError('Invalid Authentication');
    };
    try {
      const { userId, userName} = verifyToken({token});
      req.user = { userId, userName };
      next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid Authentication');
    }
};

const permissions = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.admin.role)){
      throw new UnauthorizedError('Unauthorized to access this');
    }
    next();
  }
};

module.exports = {
  authMiddleware,
  permissions,
}