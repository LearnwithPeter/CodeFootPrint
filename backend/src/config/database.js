
// Creates ONE Prisma Client instance that the whole app shares.
// Why a singleton? Each PrismaClient opens its own connection pool to
// PostgreSQL. If every file created its own client, we'd waste connections
// and could exhaust the database's connection limit.
//
// As of Prisma 7, PrismaClient must be constructed with a driver adapter -
// it can no longer read the connection string on its own. PrismaPg is
// that adapter for PostgreSQL (works with Neon and any standard Postgres).

import * as prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "./env.js";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;