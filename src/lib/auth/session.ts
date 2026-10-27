import { forbidden, unauthorized } from "@/lib/errors";
import { readAuthCookies } from "./cookies";
import { type AccessTokenPayload, verifyAccessToken } from "./jwt";

export async function requireAuth(): Promise<AccessTokenPayload> {
  const { accessToken } = await readAuthCookies();
  if (!accessToken) {
    throw unauthorized();
  }
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    throw unauthorized("Tu sesión expiró");
  }
  return payload;
}

export async function requireAdmin(): Promise<AccessTokenPayload> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    throw forbidden();
  }
  return session;
}

export async function getOptionalSession(): Promise<AccessTokenPayload | null> {
  const { accessToken } = await readAuthCookies();
  return accessToken ? verifyAccessToken(accessToken) : null;
}