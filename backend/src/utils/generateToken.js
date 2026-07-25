// Small, focused helpers for creating and checking JWTs.
// Keeping this separate from authService.js means if we ever swap how
// tokens are generated, we only touch this one file.

import jwt from "jsonwebtoken";
import env from "../config/env.js";

// Creates a signed token that encodes the user's id.
// The client will send this token back on every future request
// so we know who they are without asking for a password again.
export const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

// Checks that a token is valid and not expired.
// Throws an error automatically if the token was tampered with or expired -
// authMiddleware.js will catch that error.
export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
