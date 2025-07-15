const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode, statusMessage } = res;

    const logMessage = `${method} ${originalUrl} ${statusCode} ${statusMessage} (${duration}ms)`;
    logger.info(logMessage);
  });

  next();
};

module.exports = requestLogger;
