require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || "127.0.0.1",
  api: {
    prefix: "/api/v1",
    version: "1.0.0"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  }
};

module.exports = config;
