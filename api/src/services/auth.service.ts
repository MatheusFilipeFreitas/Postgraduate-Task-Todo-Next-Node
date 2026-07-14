import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepository } from "../repositories/user.repository";
import { LoginInput, LoginResponse, RegisterInput } from "../types/auth.types";
import { User } from "../types/user.types";
import { HttpError } from "../utils/http-error";
import { toUserResponse } from "../utils/mappers";
import { validateEmail, validatePassword, validateUsername } from "../utils/validators";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<User> {
    const username = validateUsername(input.username);
    const email = validateEmail(input.email);
    const password = validatePassword(input.password);

    if (await this.userRepository.findByEmail(email)) {
      throw new HttpError(400, "Email already registered");
    }

    if (await this.userRepository.findByUsername(username)) {
      throw new HttpError(400, "Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const email = validateEmail(input.email);
    const password = validatePassword(input.password);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: "7d" });

    return { ...toUserResponse(user), token };
  }
}
