import { z } from "zod";

export const createReservationSchema = z.object({
  spaceId: z.uuid(),
  startsAt: z.iso.datetime({ offset: true }),
  hours: z.number().int(),
});

export type CreateReservationBody = z.infer<typeof createReservationSchema>;