const app = require("./app");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
  logger.info(`Server is running on port ${PORT}`);
});
