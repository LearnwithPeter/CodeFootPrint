// Validation RULES for starting a repository analysis.
// Plugged into routes; validateRequest.js middleware checks the results.

import { body } from "express-validator";
import { parseRepoUrl } from "../utils/helpers.js";

export const analyzeRepositoryValidationRules = [
  body("repoUrl")
    .trim()
    .notEmpty()
    .withMessage("Repository URL is required")
    .custom((value) => {
      if (!parseRepoUrl(value)) {
        throw new Error(
          "Repository URL must look like https://github.com/owner/repo"
        );
      }
      return true;
    }),

  body("githubUsername")
    .trim()
    .notEmpty()
    .withMessage("GitHub username is required")
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage("GitHub username contains invalid characters"),
];
