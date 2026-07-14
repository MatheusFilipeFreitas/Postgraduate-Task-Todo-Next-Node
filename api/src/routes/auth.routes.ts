import { RequestHandler, Router } from "express";
import { authLimiter } from "../middleware/security.middleware";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { clearAuthCookie, setAuthCookie } from "../utils/auth-cookie";
import { toUserResponse } from "../utils/mappers";
import { requireFields } from "../utils/validators";

export function createAuthRouter(
  authService: AuthService,
  authenticate: RequestHandler
): Router {
  const router = Router();

  router.post(
    "/register",
    authLimiter,
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["username", "email", "password"]);

      const user = await authService.register(req.body);
      res.status(201).json(toUserResponse(user));
    })
  );

  router.post(
    "/login",
    authLimiter,
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["email", "password"]);

      const result = await authService.login(req.body);
      setAuthCookie(res, result.token);
      res.status(200).json({
        id: result.id,
        username: result.username,
        email: result.email,
        token: result.token,
      });
    })
  );

  router.post(
    "/logout",
    asyncHandler(async (_req, res) => {
      clearAuthCookie(res);
      res.status(200).json({ ok: true });
    })
  );

  router.get(
    "/session",
    authenticate,
    asyncHandler(async (_req, res) => {
      res.status(200).json({ authenticated: true });
    })
  );

  router.get(
    "/user",
    authenticate,
    asyncHandler(async (req, res) => {
      res.status(200).json(req.user);
    })
  );

  return router;
}
