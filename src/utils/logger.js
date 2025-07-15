const path = require("path");
const fs = require("fs");
const { createLogger, format, transports } = require("winston");

// Buat folder log jika belum ada
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: "info", // default: log semua info, warn, error
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    // Simpan log ke file
    new transports.File({ filename: path.join(logDir, "log.txt") }),

    // Tampilkan ke console juga
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}] ${message}`
        )
      ),
    }),
  ],
});

module.exports = logger;
