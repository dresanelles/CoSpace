import { setAuthCookies } from "@/lib/auth/cookies";
import { json, parseBody, withErrorHandling } from "@/lib/http";
import { toUserDTO } from "@/lib/mappers";
import { loginSchema } from "@/lib/validation/auth";
import { login } from "@/services/auth.service";

export const POST = withErrorHandling(async (request: Request) => {
  const body = await parseBody(request, loginSchema);
  const { user, tokens } = await login(body);
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  return json({ user: toUserDTO(user) });
});