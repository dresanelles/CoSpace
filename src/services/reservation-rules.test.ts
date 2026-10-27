import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { assertValidSlot, calculateTotalPrice, canUserCancel } from "./reservation-rules";

const NOW = new Date("2026-10-27T15:00:00Z"); // 10:00 en Bogotá

function codeOf(run: () => void): string | undefined {
  try {
    run();
  } catch (error) {
    return error instanceof AppError ? error.code : "UNEXPECTED";
  }
  return undefined;
}

describe("assertValidSlot", () => {
  it("acepta una reserva válida", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-28T15:00:00Z"), 2, NOW))).toBeUndefined();
  });
  it("rechaza duraciones de 0 o más de 4 horas (RN-01)", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-28T15:00:00Z"), 5, NOW))).toBe("INVALID_DURATION");
  });
  it("rechaza inicios que no son hora exacta (RN-01)", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-28T15:30:00Z"), 1, NOW))).toBe("INVALID_START_TIME");
  });
  it("rechaza antes de las 07:00 y después de las 21:00 (RN-02)", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-28T11:00:00Z"), 1, NOW))).toBe("OUTSIDE_BUSINESS_HOURS");
    expect(codeOf(() => assertValidSlot(new Date("2026-10-29T01:00:00Z"), 2, NOW))).toBe("OUTSIDE_BUSINESS_HOURS");
  });
  it("acepta terminar justo a las 21:00 (RN-02)", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-29T01:00:00Z"), 1, NOW))).toBeUndefined();
  });
  it("rechaza el pasado y más de 30 días (RN-03)", () => {
    expect(codeOf(() => assertValidSlot(new Date("2026-10-27T14:00:00Z"), 1, NOW))).toBe("RESERVATION_IN_PAST");
    expect(codeOf(() => assertValidSlot(new Date("2026-11-27T15:00:00Z"), 1, NOW))).toBe("TOO_FAR_AHEAD");
  });
});

describe("canUserCancel", () => {
  it("permite cancelar con 2 horas o más de antelación (RN-10)", () => {
    expect(canUserCancel(new Date("2026-10-27T17:00:00Z"), NOW)).toBe(true);
  });
  it("no permite cancelar con menos de 2 horas (RN-10)", () => {
    expect(canUserCancel(new Date("2026-10-27T16:59:00Z"), NOW)).toBe(false);
  });
});

describe("calculateTotalPrice", () => {
  it("calcula horas por precio (RN-08)", () => {
    expect(calculateTotalPrice(45000, 3)).toBe(135000);
  });
});