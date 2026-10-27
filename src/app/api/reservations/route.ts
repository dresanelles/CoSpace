import { requireAuth } from "@/lib/auth/session";
import { json, parseBody, withErrorHandling } from "@/lib/http";
import { toReservationDTO } from "@/lib/mappers";
import { createReservationSchema } from "@/lib/validation/reservations";
import { createReservation, listUserReservations } from "@/services/reservations.service";

export const GET = withErrorHandling(async () => {
  const session = await requireAuth();
  const items = await listUserReservations(session.sub);
  return json({ reservations: items.map(toReservationDTO) });
});

export const POST = withErrorHandling(async (request: Request) => {
  const session = await requireAuth();
  const body = await parseBody(request, createReservationSchema);
  const idempotencyKey = request.headers.get("idempotency-key") ?? undefined;
  const item = await createReservation(session.sub, body, idempotencyKey);
  return json({ reservation: toReservationDTO(item) }, 201);
});