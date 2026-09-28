const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env.config');

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = async ({ username, email, password }) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (username) conditions.push({ username });
  const userExists = await User.findOne({ $or: conditions });
  if (userExists) {
    const error = new Error('User with this email or username already exists');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  return {
    token: generateToken(user._id, user.username),
    user: {
      id: user._id,
      username: user.username
    }
  };
};

const loginUser = async ({ username, email, password }) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (username) conditions.push({ username });
  const user = await User.findOne({ $or: conditions });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      token: generateToken(user._id, user.username),
      user: {
        id: user._id,
        username: user.username
      }
    };
  } else {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    totalWins: user.totalWins,
    totalLosses: user.totalLosses
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
