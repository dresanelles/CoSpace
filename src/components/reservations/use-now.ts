import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

let current = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((notify) => notify());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearInterval(timer);
  };
}

/**
 * Hora actual del navegador (ms), refrescada cada 30 s.
 * En el servidor devuelve 0: el servidor no conoce la hora local del usuario,
 * así que nada que dependa de ella se pinta hasta que el cliente monta.
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, () => current, () => 0);
}
