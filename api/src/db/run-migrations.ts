import { spawnSync } from "child_process";
import { env } from "../config/env";

export async function runMigrations(): Promise<void> {
  const result = spawnSync(
    "npx",
    ["node-pg-migrate", "-j", "ts", "-m", "migrations", "up"],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: env.databaseUrl,
      },
    }
  );

  if (result.status !== 0) {
    throw new Error("Database migration failed");
  }
}
