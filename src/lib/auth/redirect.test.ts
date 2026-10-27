import { describe, expect, it } from "vitest";
import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("acepta rutas internas con query", () => {
    expect(safeNextPath("/dashboard?tab=1")).toBe("/dashboard?tab=1");
  });
  it("rechaza URLs absolutas y rutas protocolo-relativas", () => {
    expect(safeNextPath("https://evil.com")).toBe("/dashboard");
    expect(safeNextPath("//evil.com")).toBe("/dashboard");
  });
  it("rechaza barras invertidas y valores vacíos", () => {
    expect(safeNextPath("/\\evil.com")).toBe("/dashboard");
    expect(safeNextPath(null)).toBe("/dashboard");
  });
});