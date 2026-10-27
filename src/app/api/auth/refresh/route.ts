import { NextResponse } from "next/server";
import { clearAuthCookies, readAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import { safeNextPath } from "@/lib/auth/redirect";
import { AppError } from "@/lib/errors";
import { errorResponse, json, withErrorHandling } from "@/lib/http";
import { toUserDTO } from "@/lib/mappers";
import { refresh } from "@/services/auth.service";

export const POST = withErrorHandling(async () => {
  const { refreshToken } = await readAuthCookies();
  try {
    const { user, tokens } = await refresh(refreshToken);
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);
    return json({ user: toUserDTO(user) });
  } catch (error) {
    await clearAuthCookies();
    throw error;
  }
});

export async function GET(request: Request): Promise<Response> {
  const { origin, searchParams } = new URL(request.url);
  const next = safeNextPath(searchParams.get("next"));
  const { refreshToken } = await readAuthCookies();

  try {
    const { tokens } = await refresh(refreshToken);
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);
    return NextResponse.redirect(new URL(next, origin));
  } catch (error) {
    if (error instanceof AppError && error.status === 401) {
      await clearAuthCookies();
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("next", next);
      return NextResponse.redirect(loginUrl);
    }
    return errorResponse(error);
  }
}