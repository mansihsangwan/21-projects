const jwt = require("jsonwebtoken");
const config = require("../config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    const error = new Error("Authorization token missing");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    const authError = new Error("Invalid or expired token");
    authError.statusCode = 401;
    next(authError);
  }
}

module.exports = authMiddleware;
