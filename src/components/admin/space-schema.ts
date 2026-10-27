import { z } from "zod";

// Los mensajes son claves de traducción (namespace "validation"), no texto.
export const spaceSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(100, "spaceNameMax"),
  description: z.string().trim().min(10, "descriptionMin").max(1000, "descriptionMax"),
  type: z.enum(["desk", "meeting_room", "cabin"], { error: "chooseType" }),
  capacity: z.coerce.number().int("integer").min(1, "capacityMin").max(100, "capacityMax"),
  pricePerHour: z.coerce.number().int("integer").min(1000, "priceMin").max(1_000_000, "priceMax"),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => value.startsWith("/") || value.startsWith("https://"), "imageFormat"),
  // El formulario envía texto separado por comas; la API recibe un arreglo.
  amenities: z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(40, "amenityMax")).max(10, "amenitiesMax")),
});
