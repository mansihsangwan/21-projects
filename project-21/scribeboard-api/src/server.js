const app = require("./app");
const config = require("./config");

const server = app.listen(config.port, config.host, () => {
  console.log(`Server running on http://${config.host}:${config.port}`);
  console.log(`Environment: ${config.env}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${config.port} is already in use.`);
  } else if (error.code === "EACCES") {
    console.error(`Permission denied for ${config.host}:${config.port}.`);
  } else {
    console.error("Server failed to start:", error);
  }
  process.exit(1);
});

function gracefulShutdown(signal) {
  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

module.exports = server;
