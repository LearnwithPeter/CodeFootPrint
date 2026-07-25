// Defines the validation RULES for auth requests.
// These don't run by themselves - they're plugged into routes, and
// validateRequest.js (middleware) checks the results and rejects bad input
// with a 400 before it ever reaches a controller.

import { body } from "express-validator";

export const registerValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationRules = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
