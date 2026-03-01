const express = require("express");
const config = require("../config");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ScribeBoard API is running",
    version: config.api.version,
    environment: config.env,
    endpoints: {
      authRegister: "/api/v1/auth/register",
      authLogin: "/api/v1/auth/login",
      authMe: "/api/v1/auth/me",
      boards: "/api/v1/boards",
      boardById: "/api/v1/boards/:boardId",
      notes: "/api/v1/boards/:boardId/notes"
    }
  });
});

router.post("/echo", (req, res) => {
  res.json({
    success: true,
    message: "Echo response",
    received: {
      body: req.body,
      timestamp: new Date().toISOString()
    }
  });
});

router.get("/config", (req, res) => {
  if (config.env === "production") {
    return res.status(403).json({
      success: false,
      error: { message: "This endpoint is disabled in production" }
    });
  }

  res.json({
    success: true,
    config
  });
});

router.get("/error", (req, res, next) => {
  const error = new Error("This is a test error");
  error.statusCode = 500;
  next(error);
});

module.exports = router;
