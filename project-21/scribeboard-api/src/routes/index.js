const express = require("express");
const config = require("../config");
const apiRoutes = require("./api.routes");
const authRoutes = require("../modules/auth/auth.routes");
const boardRoutes = require("../modules/board/board.routes");

const router = express.Router();

router.use(config.api.prefix, apiRoutes);
router.use(`${config.api.prefix}/auth`, authRoutes);
router.use(`${config.api.prefix}/boards`, boardRoutes);

router.get("/", (req, res) => {
  res.json({
    name: "ScribeBoard API",
    version: config.api.version,
    status: "running",
    links: {
      health: "/health",
      api: config.api.prefix,
      auth: `${config.api.prefix}/auth`,
      boards: `${config.api.prefix}/boards`
    }
  });
});

module.exports = router;
