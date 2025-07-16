const winston = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    const baseMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    return stack ? `${baseMessage}\n${stack}` : baseMessage;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "log.txt"),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

// Tambahan log ke console saat dev
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  );
}

module.exports = logger;
