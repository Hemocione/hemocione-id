const { CustomAPIError } = require('../errors/customAPIError');

const wrapAsyncOperationalErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (e) {
      console.log('oiii')
      console.log(typeof e)
      console.log(e.name)
      console.log(e.message)
      if (e instanceof CustomAPIError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };
};

module.exports = wrapAsyncOperationalErrors;
