const config = require("../config");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      ...(config.env === "development" && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;
