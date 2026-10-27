"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import type { UserRole } from "@/types/api";

interface AuthGuardProps {
  /** Rol exigido; sin él basta con tener sesión. */
  role?: UserRole;
  children: ReactNode;
}

/**
 * Comodidad de interfaz: lleva al login a quien no tiene sesión y fuera del panel a quien no es admin.
 * La protección real está en el servidor (proxy y rutas de la API), nunca aquí.
 */
export function AuthGuard({ role, children }: AuthGuardProps) {
  const router = useRouter();
  // user === undefined: la sesión aún no se ha consultado; null: no hay sesión.
  const { data: user } = useCurrentUser();

  const denied = user !== undefined && (!user || (role !== undefined && user.role !== role));

  useEffect(() => {
    if (denied) router.replace(user ? "/" : "/login");
  }, [denied, router, user]);

  if (user === undefined || denied) return null;
  return <>{children}</>;
}
