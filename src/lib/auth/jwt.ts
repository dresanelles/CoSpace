import { jwtVerify, SignJWT } from "jose";
import type { UserRole } from "@/types/api";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
}

const ALGORITHM = "HS256";
const DURATION_UNITS: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const accessSecret = (): Uint8Array => new TextEncoder().encode(requireEnv("JWT_ACCESS_SECRET"));
const refreshSecret = (): Uint8Array => new TextEncoder().encode(requireEnv("JWT_REFRESH_SECRET"));

export const accessTtl = (): string => process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m";
export const refreshTtl = (): string => process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d";

export function durationToSeconds(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }
  const [, amount, unit] = match;
  return Number(amount) * DURATION_UNITS[unit];
}

export function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(accessTtl())
    .sign(accessSecret());
}

export function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(userId)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(refreshTtl())
    .sign(refreshSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret(), { algorithms: [ALGORITHM] });
    const role = payload.role;
    if (typeof payload.sub !== "string" || (role !== "user" && role !== "admin")) {
      return null;
    }
    return { sub: payload.sub, role };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret(), { algorithms: [ALGORITHM] });
    if (typeof payload.sub !== "string") {
      return null;
    }
    return { sub: payload.sub };
  } catch {
    return null;
  }
}