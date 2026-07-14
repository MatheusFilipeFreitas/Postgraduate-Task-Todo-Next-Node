import dotenv from "dotenv";
import { createPool, checkDatabaseConnection, closePool } from "../src/config/database";
import { runMigrations } from "../src/db/run-migrations";
import { runSeed } from "./seed";

dotenv.config();

async function waitForDatabase(maxAttempts = 30): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      createPool();
      await checkDatabaseConnection();
      await closePool();
      console.log("Database is ready");
      return;
    } catch {
      console.log(`Waiting for database... (${attempt}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Database connection timed out");
}

async function main() {
  await waitForDatabase();
  await runMigrations();
  await runSeed();
  console.log("Database setup complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Database setup failed:", error);
    process.exit(1);
  });
