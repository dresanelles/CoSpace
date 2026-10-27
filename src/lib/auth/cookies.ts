import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./constants";
import { accessTtl, durationToSeconds, refreshTtl } from "./jwt";

const baseOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: durationToSeconds(accessTtl()),
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: durationToSeconds(refreshTtl()),
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ACCESS_COOKIE, path: "/" });
  store.delete({ name: REFRESH_COOKIE, path: "/" });
}

export async function readAuthCookies(): Promise<{ accessToken?: string; refreshToken?: string }> {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_COOKIE)?.value,
    refreshToken: store.get(REFRESH_COOKIE)?.value,
  };
}