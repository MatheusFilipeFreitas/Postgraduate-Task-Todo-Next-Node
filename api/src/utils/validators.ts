import { Uuid } from "../types/common.types";
import { TASK_STATUSES, TaskStatus } from "../types/task.types";
import { HttpError } from "./http-error";
import { isValidUuid } from "./uuid";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireFields(
  body: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter((field) => !body[field]);

  if (missing.length > 0) {
    throw new HttpError(
      400,
      `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required`
    );
  }
}

export function parseTaskId(rawId: string | string[]): Uuid {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (typeof id !== "string" || !isValidUuid(id)) {
    throw new HttpError(400, "Invalid task id");
  }

  return id;
}

export function validateEmail(email: unknown): string {
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    throw new HttpError(400, "Invalid email format");
  }

  return email.toLowerCase().trim();
}

export function validatePassword(password: unknown): string {
  if (typeof password !== "string" || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  return password;
}

export function validateUsername(username: unknown): string {
  if (typeof username !== "string" || username.trim().length < 3 || username.length > 30) {
    throw new HttpError(400, "Username must be between 3 and 30 characters");
  }

  return username.trim();
}

export function validateTitle(title: unknown): string {
  if (typeof title !== "string" || title.trim().length === 0 || title.length > 200) {
    throw new HttpError(400, "Title must be between 1 and 200 characters");
  }

  return title.trim();
}

export function validateStatus(status: unknown): TaskStatus {
  if (typeof status !== "string" || !TASK_STATUSES.includes(status as TaskStatus)) {
    throw new HttpError(400, `Status must be one of: ${TASK_STATUSES.join(", ")}`);
  }

  return status as TaskStatus;
}
