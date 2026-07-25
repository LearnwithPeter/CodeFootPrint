// Runs AFTER the validation rules (e.g. registerValidationRules) have checked
// the request. If any rule failed, this middleware stops the request here
// and returns 400 - the controller never even runs.

import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // return the first validation error
    });
  }

  next();
};

export default validateRequest;
