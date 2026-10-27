import { getOptionalSession, requireAdmin } from "@/lib/auth/session";
import { json, parseBody, withErrorHandling } from "@/lib/http";
import { toSpaceDTO } from "@/lib/mappers";
import { parseUuid } from "@/lib/validation/common";
import { updateSpaceSchema } from "@/lib/validation/spaces";
import { getSpace, updateSpace } from "@/services/spaces.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withErrorHandling(async (_request: Request, { params }: RouteContext) => {
  const id = parseUuid((await params).id);
  const session = await getOptionalSession();
  const space = await getSpace(id, session?.role === "admin");
  return json({ space: toSpaceDTO(space) });
});

export const PATCH = withErrorHandling(async (request: Request, { params }: RouteContext) => {
  await requireAdmin();
  const id = parseUuid((await params).id);
  const body = await parseBody(request, updateSpaceSchema);
  const space = await updateSpace(id, body);
  return json({ space: toSpaceDTO(space) });
});