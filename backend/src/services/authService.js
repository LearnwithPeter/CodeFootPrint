// Business logic for authentication. This file:
// - talks to the database (via Prisma)
// - hashes/compares passwords
// - generates JWTs
// It never touches req/res directly - that's the controller's job.

import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import AppError from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import logger from "../utils/logger.js";

const SALT_ROUNDS = 10;

// Strips the password field out before sending a user object back to the client.
// We NEVER want a password hash - even a hashed one - leaving the server.
const toSafeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateToken(newUser.id);

  logger.info(`New user registered: ${newUser.id}`);

  return { user: toSafeUser(newUser), token };
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toSafeUser(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Same error message for "no such email" and "wrong password" on purpose -
  // this stops attackers from figuring out which emails are registered.
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  logger.info(`User logged in: ${user.id}`);

  return { user: toSafeUser(user), token };
};
