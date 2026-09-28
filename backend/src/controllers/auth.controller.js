const authService = require('../services/auth.service');

const registerUser = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userProfile = await authService.getUserProfile(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
