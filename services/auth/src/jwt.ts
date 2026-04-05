import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "sk-mbg-assignment-secret-key";

export interface JWTPayload {
  userId: string;
  role: string;
}

export function sign(payload: JWTPayload, options?: { expiresIn?: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: options?.expiresIn || "24h" });
}

export function verify(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
