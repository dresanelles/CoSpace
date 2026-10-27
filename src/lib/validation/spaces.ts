import { z } from "zod";

export const spaceTypeSchema = z.enum(["desk", "meeting_room", "cabin"]);

export const createSpaceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  type: spaceTypeSchema,
  capacity: z.number().int().min(1).max(100),
  pricePerHour: z.number().int().min(1000).max(1_000_000),
  imageUrl: z.string().trim().min(1).max(500),
  amenities: z.array(z.string().trim().min(1).max(40)).max(10),
});

export const updateSpaceSchema = createSpaceSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: "Envía al menos un campo" });

export const listSpacesQuerySchema = z.object({
  type: spaceTypeSchema.optional(),
  includeInactive: z.enum(["true", "false"]).optional(),
});

export const availabilityQuerySchema = z.object({ date: z.iso.date() });

export type CreateSpaceBody = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceBody = z.infer<typeof updateSpaceSchema>;