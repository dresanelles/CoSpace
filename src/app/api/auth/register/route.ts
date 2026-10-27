import { setAuthCookies } from "@/lib/auth/cookies";
import { json, parseBody, withErrorHandling } from "@/lib/http";
import { toUserDTO } from "@/lib/mappers";
import { registerSchema } from "@/lib/validation/auth";
import { register } from "@/services/auth.service";

export const POST = withErrorHandling(async (request: Request) => {
  const body = await parseBody(request, registerSchema);
  const { user, tokens } = await register(body);
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  return json({ user: toUserDTO(user) }, 201);
});