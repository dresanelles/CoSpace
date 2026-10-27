import { requireAdmin } from "@/lib/auth/session";
import { json, withErrorHandling } from "@/lib/http";
import { toSpaceDTO } from "@/lib/mappers";
import { parseUuid } from "@/lib/validation/common";
import { deactivateSpace } from "@/services/spaces.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandling(async (_request: Request, { params }: RouteContext) => {
  await requireAdmin();
  const id = parseUuid((await params).id);
  const space = await deactivateSpace(id);
  return json({ space: toSpaceDTO(space) });
});