const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      
      req.user = decoded; // { id, username }
      next();
    } catch (error) {
      return res.status(401).json({ status: 'fail', data: { message: 'Not authorized, token failed' } });
    }
  } else {
    return res.status(401).json({ status: 'fail', data: { message: 'Not authorized, no token' } });
  }
};

module.exports = { protect };
