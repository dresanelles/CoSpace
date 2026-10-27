import { json, parseQuery, withErrorHandling } from "@/lib/http";
import { parseUuid } from "@/lib/validation/common";
import { availabilityQuerySchema } from "@/lib/validation/spaces";
import { getAvailability } from "@/services/spaces.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withErrorHandling(async (request: Request, { params }: RouteContext) => {
  const id = parseUuid((await params).id);
  const { date } = parseQuery(request, availabilityQuerySchema);
  return json(await getAvailability(id, date));
});