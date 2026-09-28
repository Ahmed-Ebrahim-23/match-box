const env = require('../config/env.config');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
