import dotenv from "dotenv";

dotenv.config();

// Extract variables
const { PORT, DATABASE_URL, JWT_SECRET, NODE_ENV } = process.env;

/* -------------------------
   PORT Validation
-------------------------- */

const parsedPort = PORT === undefined ? 3000 : Number(PORT);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

/* -------------------------
   DATABASE_URL Validation
-------------------------- */

if (!DATABASE_URL?.trim()) {
  throw new Error("DATABASE_URL is required");
}

try {
  new URL(DATABASE_URL);
} catch {
  throw new Error("DATABASE_URL must be a valid URL");
}

/* -------------------------
   JWT_SECRET Validation
-------------------------- */

if (!JWT_SECRET?.trim()) {
  throw new Error("JWT_SECRET is required");
}

/* -------------------------
   NODE_ENV Validation
-------------------------- */

const allowedEnvs = ["development", "production", "test"] as const;

if (!NODE_ENV || !allowedEnvs.includes(NODE_ENV as any)) {
  throw new Error("NODE_ENV must be one of: development | production | test");
}

/* -------------------------
   AppConfig Type
-------------------------- */

export type AppConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  nodeEnv: (typeof allowedEnvs)[number];
};

/* -------------------------
   Export Frozen Config
-------------------------- */

export const config = Object.freeze<AppConfig>({
  port: parsedPort,
  databaseUrl: DATABASE_URL,
  jwtSecret: JWT_SECRET,
  nodeEnv: NODE_ENV as AppConfig["nodeEnv"],
});
