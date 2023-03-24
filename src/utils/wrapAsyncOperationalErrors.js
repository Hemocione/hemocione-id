const { CustomAPIError } = require("../errors/customAPIError");

// Capturar errors esperados pela aplicação!!! :)
const wrapAsyncOperationalErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      console.log("wrapAsyncOperationalError: ", e);
      if (e instanceof CustomAPIError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };
};

module.exports = wrapAsyncOperationalErrors;
