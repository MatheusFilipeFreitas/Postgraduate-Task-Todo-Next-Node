import { Uuid } from "./common.types";
import { UserResponse } from "./user.types";

export interface JwtPayload {
  id: Uuid;
}

export interface LoginResponse extends UserResponse {
  token: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
