import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function loadJwtSecret(): string {
  const secret = isProduction
    ? requireEnv("JWT_SECRET")
    : requireEnv("JWT_SECRET", "dev-only-secret-change-in-production-32chars");

  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }

  return secret;
}

function loadCorsOrigins(): string[] {
  const raw = requireEnv("CORS_ORIGINS", "http://localhost:3000");
  return raw.split(",").map((origin) => origin.trim());
}

const db = {
  host: requireEnv("DB_HOST", "localhost"),
  port: Number(process.env.DB_PORT) || 5432,
  name: requireEnv("DB_NAME", "task_todo"),
  user: requireEnv("DB_USER", "task_todo"),
  password: requireEnv("DB_PASSWORD", "task_todo"),
};

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: loadJwtSecret(),
  corsOrigins: loadCorsOrigins(),
  isProduction,
  db,
  databaseUrl:
    process.env.DATABASE_URL ??
    `postgresql://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`,
} as const;
