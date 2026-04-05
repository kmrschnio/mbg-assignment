import type { Request, Response, NextFunction } from "express";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3004";

/**
 * Auth middleware — verifies JWT via auth service.
 * Falls back to demo user if no token provided (for development).
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  // allow unauthenticated access in dev (no token = demo user)
  if (!authHeader) {
    (req as any).user = { id: "demo-user", role: "trader" };
    next();
    return;
  }

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/verify`, {
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      res.status(401).json({ error: "invalid or expired token" });
      return;
    }

    const data = await response.json();
    (req as any).user = data.user;
    next();
  } catch {
    // auth service unreachable — fall back to demo user
    (req as any).user = { id: "demo-user", role: "trader" };
    next();
  }
}
