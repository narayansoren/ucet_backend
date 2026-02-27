import dotenv from "dotenv";

dotenv.config();

//  Allowed Environments

const allowedEnvs = ["development", "production", "test"] as const;
type NodeEnv = (typeof allowedEnvs)[number];

//  Type Guard

function isValidEnv(env: string): env is NodeEnv {
  return allowedEnvs.includes(env as NodeEnv);
}

//  Extract Variables

const { PORT, DATABASE_URL, JWT_SECRET, NODE_ENV } = process.env;

//  NODE_ENV Validation

if (!NODE_ENV || !isValidEnv(NODE_ENV)) {
  throw new Error("NODE_ENV must be one of: development | production | test");
}

//  PORT Validation

const parsedPort = PORT === undefined ? 3000 : Number(PORT);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

//  DATABASE_URL Validation

if (!DATABASE_URL?.trim()) {
  throw new Error("DATABASE_URL is required");
}

try {
  new URL(DATABASE_URL);
} catch {
  throw new Error("DATABASE_URL must be a valid URL");
}

//  JWT_SECRET Validation

if (!JWT_SECRET?.trim()) {
  throw new Error("JWT_SECRET is required");
}

//  AppConfig Type

export type AppConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  nodeEnv: NodeEnv;
};

//  Export Immutable Config

export const config: AppConfig = Object.freeze({
  port: parsedPort,
  databaseUrl: DATABASE_URL,
  jwtSecret: JWT_SECRET,
  nodeEnv: NODE_ENV,
});
