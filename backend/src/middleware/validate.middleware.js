const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map(issue => issue.message).join(', ');
      return res.status(400).json({
        status: 'fail',
        message: formattedErrors,
        details: result.error.flatten(),
      });
    }

    req[source] = result.data;
    next();
  };
};

module.exports = { validate };
