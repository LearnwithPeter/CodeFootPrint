// A small logging helper so every part of the app logs messages the same way.
// This is intentionally simple: just adds a timestamp and a level label.
// Never pass passwords, tokens, or API keys into these functions.

const timestamp = () => new Date().toISOString();

const logger = {
  info: (message) => {
    console.log(`[INFO] ${timestamp()} - ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${timestamp()} - ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] ${timestamp()} - ${message}`);
  },
};

export default logger;
