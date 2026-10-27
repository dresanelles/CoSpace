// Contrato compartido frontend <-> backend (SRS §9 y §10).
// Las fechas viajan como string ISO 8601 (UTC). El dinero son pesos COP enteros.

export type UserRole = "user" | "admin";
export type SpaceType = "desk" | "meeting_room" | "cabin";
export type ReservationStatus = "confirmed" | "cancelled";

/** Usuario público: nunca incluye passwordHash. */
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface SpaceDTO {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ReservationDTO {
  id: string;
  userId: string;
  spaceId: string;
  startsAt: string;
  endsAt: string;
  totalPrice: number;
  status: ReservationStatus;
  cancelledAt: string | null;
  createdAt: string;
  /** Resumen del espacio para pintar el listado sin otra petición. */
  space: Pick<SpaceDTO, "id" | "name" | "type" | "imageUrl">;
}

/** Formato único de error de la API (SRS §10). */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ---- Entradas ----

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** El precio total NO viaja: lo calcula el servidor (RN-08). */
export interface CreateReservationInput {
  spaceId: string;
  startsAt: string;
  hours: number;
}

export interface CreateSpaceInput {
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  amenities: string[];
}

export type UpdateSpaceInput = Partial<CreateSpaceInput>;

// ---- Salidas ----

export interface AvailabilityDTO {
  date: string; // YYYY-MM-DD
  busyHours: number[]; // horas de inicio ocupadas, 7..20
}
