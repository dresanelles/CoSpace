import type { User } from "@/db/schema";
import type { UserDTO } from "@/types/api";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}