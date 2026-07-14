import { Pool } from "pg";
import { Uuid } from "../types/common.types";
import { Task, TaskStatus } from "../types/task.types";
import { HttpError } from "../utils/http-error";

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  status: string;
}

function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    status: row.status as TaskStatus,
  };
}

export class TaskRepository {
  constructor(private readonly pool: Pool) {}

  async findAllByUserId(userId: Uuid): Promise<Task[]> {
    const result = await this.pool.query<TaskRow>(
      `SELECT id, user_id, title, status
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map(mapTaskRow);
  }

  async findByIdAndUserId(taskId: Uuid, userId: Uuid): Promise<Task | undefined> {
    const result = await this.pool.query<TaskRow>(
      `SELECT id, user_id, title, status
       FROM tasks
       WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    return result.rows[0] ? mapTaskRow(result.rows[0]) : undefined;
  }

  async create(data: Omit<Task, "id">): Promise<Task> {
    const result = await this.pool.query<TaskRow>(
      `INSERT INTO tasks (user_id, title, status)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, status`,
      [data.userId, data.title, data.status]
    );

    return mapTaskRow(result.rows[0]);
  }

  async updateStatus(taskId: Uuid, userId: Uuid, status: TaskStatus): Promise<Task> {
    const result = await this.pool.query<TaskRow>(
      `UPDATE tasks
       SET status = $3, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, title, status`,
      [taskId, userId, status]
    );

    if (!result.rows[0]) {
      throw new HttpError(404, "Task not found");
    }

    return mapTaskRow(result.rows[0]);
  }

  async delete(taskId: Uuid, userId: Uuid): Promise<void> {
    const result = await this.pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, "Task not found");
    }
  }
}
