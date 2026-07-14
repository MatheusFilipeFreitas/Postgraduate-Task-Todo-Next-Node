import express from "express";
import cookieParser from "cookie-parser";
import { checkDatabaseConnection, closePool, createPool, getPool } from "./config/database";
import { env } from "./config/env";
import { runMigrations } from "./db/run-migrations";
import { createAuthenticate } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { applySecurityMiddleware } from "./middleware/security.middleware";
import { UserRepository } from "./repositories/user.repository";
import { TaskRepository } from "./repositories/task.repository";
import { createAuthRouter } from "./routes/auth.routes";
import { createTaskRouter } from "./routes/task.routes";
import { AuthService } from "./services/auth.service";
import { TaskService } from "./services/task.service";

const app = express();

async function bootstrap() {
  const pool = createPool();
  await checkDatabaseConnection();
  await runMigrations();

  const userRepository = new UserRepository(pool);
  const taskRepository = new TaskRepository(pool);
  const authService = new AuthService(userRepository);
  const taskService = new TaskService(taskRepository);
  const authenticate = createAuthenticate(userRepository);

  applySecurityMiddleware(app);
  app.use(cookieParser());
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", async (_req, res, next) => {
    try {
      await checkDatabaseConnection();
      res.status(200).json({ status: "ok", database: "connected" });
    } catch (error) {
      next(error);
    }
  });

  app.use("/auth", createAuthRouter(authService, authenticate));
  app.use("/tasks", createTaskRouter(taskService, authenticate));

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  const server = app.listen(env.port, () => {
    console.log(`Task Todo API running on http://localhost:${env.port}`);
  });

  function shutdown(signal: string) {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
