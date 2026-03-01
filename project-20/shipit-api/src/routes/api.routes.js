const express = require("express");
const config = require("../config");

const router = express.Router();

const items = [
  { id: 1, name: "Deploy app", status: "pending", priority: "high" },
  { id: 2, name: "Set env vars", status: "completed", priority: "high" },
  { id: 3, name: "Test endpoints", status: "completed", priority: "medium" }
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShipIt API is running",
    version: config.api.version,
    environment: config.env,
    endpoints: {
      items: "/api/v1/items",
      echo: "/api/v1/echo",
      authRegister: "/api/v1/auth/register",
      authLogin: "/api/v1/auth/login",
      authMe: "/api/v1/auth/me"
    }
  });
});

router.get("/items", (req, res) => {
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

router.get("/items/:id", (req, res) => {
  const item = items.find((entry) => entry.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({
      success: false,
      error: { message: `Item with ID ${req.params.id} not found` }
    });
  }

  res.json({
    success: true,
    data: item
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
