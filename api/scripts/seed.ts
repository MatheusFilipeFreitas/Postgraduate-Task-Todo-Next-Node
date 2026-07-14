import dotenv from "dotenv";
import { createPool, closePool } from "../src/config/database";

dotenv.config();

const SEED_USER = {
  id: "a1e27132-dec4-4856-a7f8-daee8c4f7d32",
  username: "john",
  email: "john@example.com",
  password: "$2b$10$9oheC6rFB2CZklhFiYnn0eEqdjs5ir.WJ.PcfycDFN3oQLV5py.JS",
};

const SEED_TASKS = [
  {
    id: "d8fe4987-0b43-4078-bfb4-df5b533740ec",
    userId: SEED_USER.id,
    title: "Learn PostgreSQL",
    status: "pending",
  },
  {
    id: "e17f4a21-3c9b-4a12-9f01-8b2d6c4e5a10",
    userId: SEED_USER.id,
    title: "Build Task Todo API",
    status: "in_progress",
  },
];

export async function runSeed(): Promise<void> {
  const pool = createPool();

  try {
    await pool.query(
      `INSERT INTO users (id, username, email, password)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [SEED_USER.id, SEED_USER.username, SEED_USER.email, SEED_USER.password]
    );

    for (const task of SEED_TASKS) {
      await pool.query(
        `INSERT INTO tasks (id, user_id, title, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [task.id, task.userId, task.title, task.status]
      );
    }

    console.log("Seed data applied");
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
