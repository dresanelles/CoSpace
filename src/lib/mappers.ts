import type { Space, User } from "@/db/schema";
import type { SpaceDTO, UserDTO } from "@/types/api";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toSpaceDTO(space: Space): SpaceDTO {
  return { ...space, createdAt: space.createdAt.toISOString() };
}