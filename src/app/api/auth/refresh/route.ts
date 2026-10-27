import { clearAuthCookies, readAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import { json, withErrorHandling } from "@/lib/http";
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