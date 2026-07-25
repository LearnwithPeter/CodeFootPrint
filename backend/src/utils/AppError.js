// A regular JavaScript Error only has a "message". We need a "statusCode"
// too, so errorMiddleware.js knows whether to respond with 400, 401, 404, etc.
// Services throw this instead of a plain Error whenever they want to control
// the exact HTTP response the client receives.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
