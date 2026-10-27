import { requireAuth } from "@/lib/auth/session";
import { unauthorized } from "@/lib/errors";
import { json, withErrorHandling } from "@/lib/http";
import { toUserDTO } from "@/lib/mappers";
import { getUserById } from "@/services/auth.service";

export const GET = withErrorHandling(async () => {
  const session = await requireAuth();
  const user = await getUserById(session.sub);
  if (!user) {
    throw unauthorized();
  }
  return json({ user: toUserDTO(user) });
});