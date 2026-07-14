import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepository } from "../repositories/user.repository";
import { JwtPayload } from "../types/auth.types";
import { extractAuthToken } from "../utils/extract-auth-token";
import { HttpError } from "../utils/http-error";
import { toUserResponse } from "../utils/mappers";

export function createAuthenticate(userRepository: UserRepository): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractAuthToken(req);

    if (!token) {
      return next(new HttpError(401, "Authorization token is required"));
    }

    try {
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
      const user = await userRepository.findById(payload.id);

      if (!user) {
        return next(new HttpError(401, "Invalid token"));
      }

      req.user = toUserResponse(user);
      next();
    } catch {
      next(new HttpError(401, "Invalid or expired token"));
    }
  };
}
