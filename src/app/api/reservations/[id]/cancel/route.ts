import { requireAuth } from "@/lib/auth/session";
import { json, withErrorHandling } from "@/lib/http";
import { toReservationDTO } from "@/lib/mappers";
import { parseUuid } from "@/lib/validation/common";
import { cancelReservation } from "@/services/reservations.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandling(async (_request: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const id = parseUuid((await params).id);
  const item = await cancelReservation(id, session);
  return json({ reservation: toReservationDTO(item) });
});