"use client";

import useSWR, { type SWRResponse } from "swr";
import { ApiError } from "@/lib/api-error";
import { fetchCurrentUser } from "@/lib/auth-client";
import type { UserDTO } from "@/types/api";

export const SESSION_KEY = "/api/auth/me";

/** Usuario de la sesión actual, o null si no hay sesión (un visitante no es un error). */
async function fetchSessionUser(): Promise<UserDTO | null> {
  try {
    return await fetchCurrentUser();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function useCurrentUser(): SWRResponse<UserDTO | null> {
  return useSWR(SESSION_KEY, fetchSessionUser, { shouldRetryOnError: false });
}
