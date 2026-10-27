import { NextResponse } from "next/server";
import { flattenError, ZodError, type ZodType, type z } from "zod";
import type { ApiErrorBody } from "@/types/api";
import { AppError } from "./errors";

export function json<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function errorResponse(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Los datos enviados no son válidos",
          details: flattenError(error),
        },
      },
      { status: 400 },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" } },
    { status: 500 },
  );
}

type RouteHandler<Context> = (request: Request, context: Context) => Promise<Response>;

export function withErrorHandling<Context>(
  handler: RouteHandler<Context>,
): RouteHandler<Context> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export async function parseBody<S extends ZodType>(
  request: Request,
  schema: S,
): Promise<z.infer<S>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new AppError(400, "INVALID_JSON", "El cuerpo debe ser un JSON válido");
  }
  return schema.parse(raw);
}


export function parseQuery<S extends ZodType>(request: Request, schema: S): z.infer<S> {
  return schema.parse(Object.fromEntries(new URL(request.url).searchParams));
}