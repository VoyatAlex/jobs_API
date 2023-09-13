const Users = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index.js');

const register = async (req, res) => {
  const user = await Users.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Provide credantials, please.');
  }

  const user = await Users.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('User does not exist.');
  }

  // check if the hashed pass is valid
  const isPassValid = await user.comparePassword(password);

  if (!isPassValid) {
    throw new UnauthenticatedError('Wrong password.');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = { register, login };