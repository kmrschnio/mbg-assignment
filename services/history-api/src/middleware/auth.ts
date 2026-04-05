import type { Request, Response, NextFunction } from "express";

/**
 * Auth middleware — passthrough for now.
 * Bonus phase: swap to real JWT verification.
 */
export function authMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  // TODO: verify JWT token in bonus phase
  ((_req as any).user) = { id: "demo-user", role: "trader" };
  next();
}
