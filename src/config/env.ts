import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "production" | "test";

const NODE_ENV = (process.env.NODE_ENV || "development") as NodeEnv;
const PORT_RAW = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const allowedEnvs: NodeEnv[] = ["development", "production", "test"];
if (!allowedEnvs.includes(NODE_ENV)) {
  throw new Error(`Invalid NODE_ENV: ${NODE_ENV}`);
}

const parsedPort = PORT_RAW === undefined ? 3000 : Number(PORT_RAW);
if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
  throw new Error(
    "PORT must be an integer between 0 and 65535 (0 allowed for ephemeral)",
  );
}

// DATABASE_URL validation
if (!DATABASE_URL?.trim()) {
  throw new Error("DATABASE_URL is required");
}
try {
  // This validates the format minimally
  // For postgres, URL protocol must be postgres:
  const u = new URL(DATABASE_URL);
  if (!/^postgres(?:ql)?:$/.test(u.protocol)) {
    throw new Error("DATABASE_URL protocol must be postgres://");
  }
} catch (err) {
  throw new Error("Invalid DATABASE_URL format");
}

// JWT_SECRET validation
if (!JWT_SECRET?.trim()) {
  throw new Error("JWT_SECRET is required");
}

export type AppConfig = {
  nodeEnv: NodeEnv;
  port: number;
  databaseUrl: string;
  jwtSecret: string;
};

export const config = Object.freeze<AppConfig>({
  nodeEnv: NODE_ENV,
  port: parsedPort,
  databaseUrl: DATABASE_URL,
  jwtSecret: JWT_SECRET,
});
