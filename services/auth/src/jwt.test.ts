import { describe, it, expect } from "vitest";
import { sign, verify } from "./jwt.js";

describe("jwt", () => {
  it("sign then verify returns original payload", () => {
    const token = sign({ userId: "123", role: "trader" });
    const decoded = verify(token);
    expect(decoded.userId).toBe("123");
    expect(decoded.role).toBe("trader");
  });

  it("verify rejects tampered token", () => {
    const token = sign({ userId: "123", role: "trader" });
    expect(() => verify(token + "x")).toThrow();
  });

  it("verify rejects expired token", () => {
    const token = sign({ userId: "123", role: "trader" }, { expiresIn: 0 });
    expect(() => verify(token)).toThrow();
  });
});
