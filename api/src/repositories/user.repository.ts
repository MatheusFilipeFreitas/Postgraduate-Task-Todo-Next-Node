import { Pool } from "pg";
import { Uuid } from "../types/common.types";
import { User } from "../types/user.types";

interface UserRow {
  id: string;
  username: string;
  email: string;
  password: string;
}

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
  };
}

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: Uuid): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, username, email, password FROM users WHERE id = $1",
      [id]
    );

    return result.rows[0] ? mapUserRow(result.rows[0]) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, username, email, password FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0] ? mapUserRow(result.rows[0]) : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      "SELECT id, username, email, password FROM users WHERE username = $1",
      [username]
    );

    return result.rows[0] ? mapUserRow(result.rows[0]) : undefined;
  }

  async create(data: Omit<User, "id">): Promise<User> {
    const result = await this.pool.query<UserRow>(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, password`,
      [data.username, data.email, data.password]
    );

    return mapUserRow(result.rows[0]);
  }
}
