import { requireAdmin } from "@/lib/auth/session";
import { json, parseBody, parseQuery, withErrorHandling } from "@/lib/http";
import { toSpaceDTO } from "@/lib/mappers";
import { createSpaceSchema, listSpacesQuerySchema } from "@/lib/validation/spaces";
import { createSpace, listSpaces } from "@/services/spaces.service";

export const GET = withErrorHandling(async (request: Request) => {
  const query = parseQuery(request, listSpacesQuerySchema);
  const includeInactive = query.includeInactive === "true";
  if (includeInactive) {
    await requireAdmin();
  }
  const items = await listSpaces({ type: query.type, includeInactive });
  return json({ spaces: items.map(toSpaceDTO) });
});

export const POST = withErrorHandling(async (request: Request) => {
  await requireAdmin();
  const body = await parseBody(request, createSpaceSchema);
  const space = await createSpace(body);
  return json({ space: toSpaceDTO(space) }, 201);
});