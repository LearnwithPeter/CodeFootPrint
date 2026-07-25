// Prisma 7 requires this file at the project root. It replaces two things
// that used to live elsewhere:
// 1. The schema file location (used to be package.json's "prisma.schema" field)
// 2. The database connection URL used for migrations (used to be
//    schema.prisma's datasource.url)
//
// This is a CLI/tooling config file only - it does NOT affect how the
// running app connects to the database. That's handled separately in
// src/config/database.js, via a driver adapter.

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
