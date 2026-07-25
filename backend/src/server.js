// This is the entry point of the whole backend.
// Its only job is to start the server. All app configuration lives in app.js.

import app from "./app.js";
import env, { validateEnv } from "./config/env.js";
import logger from "./utils/logger.js";

try {
  validateEnv();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

app.listen(env.port, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});
