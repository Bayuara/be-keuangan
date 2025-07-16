const express = require("express");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const logger = require("./utils/logger");

const app = express();

// logger
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
