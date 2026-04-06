import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "sk-mbg-assignment-secret-key";

export interface JWTPayload {
  userId: string;
  role: string;
}

export function sign(payload: JWTPayload, options?: { expiresIn?: number }): string {
  return jwt.sign(payload as object, SECRET, {
    expiresIn: options?.expiresIn ?? 86400, // default 24h in seconds
  });
}

export function verify(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
