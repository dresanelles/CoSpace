import { clearAuthCookies, readAuthCookies } from "@/lib/auth/cookies";
import { withErrorHandling } from "@/lib/http";
import { logout } from "@/services/auth.service";

export const POST = withErrorHandling(async () => {
  const { refreshToken } = await readAuthCookies();
  await logout(refreshToken);
  await clearAuthCookies();
  return new Response(null, { status: 204 });
});