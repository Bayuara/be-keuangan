const express = require("express");
const routes = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
