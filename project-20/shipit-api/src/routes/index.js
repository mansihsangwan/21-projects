const express = require("express");
const config = require("../config");
const healthRoutes = require("./health.routes");
const apiRoutes = require("./api.routes");
const authRoutes = require("../modules/auth/auth.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use(config.api.prefix, apiRoutes);
router.use(`${config.api.prefix}/auth`, authRoutes);

router.get("/", (req, res) => {
  res.json({
    name: "ShipIt API",
    version: config.api.version,
    status: "running",
    links: {
      health: "/health",
      api: config.api.prefix,
      auth: `${config.api.prefix}/auth`
    }
  });
});

module.exports = router;
