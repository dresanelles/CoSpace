import { z } from "zod";
import { notFound } from "@/lib/errors";

export function parseUuid(raw: string): string {
  const result = z.uuid().safeParse(raw);
  if (!result.success) {
    throw notFound();
  }
  return result.data;
}