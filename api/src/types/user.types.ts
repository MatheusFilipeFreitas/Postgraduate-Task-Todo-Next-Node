import { Uuid } from "./common.types";

export interface User {
  id: Uuid;
  username: string;
  email: string;
  password: string;
}

export type UserResponse = Pick<User, "id" | "username" | "email">;
