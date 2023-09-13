const { METHOD_FAILURE } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/index.js');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Log in to get access to resource, please.');
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: tokenData.userId };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Log in to get access to resource, please.');
  }
}

module.exports = auth;