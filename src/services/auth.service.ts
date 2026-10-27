import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { refreshTokens, type User, users } from "@/db/schema";
import {
  durationToSeconds,
  refreshTtl,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth/jwt";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/token-hash";
import { AppError, conflict, unauthorized } from "@/lib/errors";
import type { LoginBody, RegisterBody } from "@/lib/validation/auth";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: SessionTokens;
}

const UNIQUE_VIOLATION = "23505";
let dummyHash: Promise<string> | undefined;

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === UNIQUE_VIOLATION
  );
}

function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword("cospace-dummy-password");
  return dummyHash;
}

async function findUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0];
}

async function createSession(user: User): Promise<SessionTokens> {
  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await signRefreshToken(user.id);
  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + durationToSeconds(refreshTtl()) * 1000),
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterBody): Promise<AuthResult> {
  if (await findUserByEmail(input.email)) {
    throw conflict("EMAIL_TAKEN", "Ya existe una cuenta con ese correo");
  }

  const passwordHash = await hashPassword(input.password);
  try {
    const [user] = await db
      .insert(users)
      .values({ email: input.email, name: input.name, passwordHash })
      .returning();
    return { user, tokens: await createSession(user) };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("EMAIL_TAKEN", "Ya existe una cuenta con ese correo");
    }
    throw error;
  }
}

export async function login(input: LoginBody): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);
  const hash = user?.passwordHash ?? (await getDummyHash());
  const validPassword = await verifyPassword(input.password, hash);

  if (!user || !validPassword) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos");
  }
  return { user, tokens: await createSession(user) };
}

export async function refresh(refreshToken: string | undefined): Promise<AuthResult> {
  if (!refreshToken) {
    throw unauthorized();
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw unauthorized("Tu sesión expiró");
  }

  const rows = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, hashToken(refreshToken)))
    .limit(1);
  const stored = rows[0];

  if (!stored || stored.userId !== payload.sub || stored.revokedAt) {
    throw unauthorized("Sesión inválida");
  }
  if (stored.expiresAt.getTime() <= Date.now()) {
    throw unauthorized("Tu sesión expiró");
  }

  // Rotación atómica: solo uno de dos refresh simultáneos puede revocar el token.
  const revoked = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(refreshTokens.id, stored.id), isNull(refreshTokens.revokedAt)))
    .returning({ id: refreshTokens.id });
  if (revoked.length === 0) {
    throw unauthorized("Sesión inválida");
  }

  const user = await getUserById(stored.userId);
  if (!user) {
    throw unauthorized("Sesión inválida");
  }
  return { user, tokens: await createSession(user) };
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) {
    return;
  }
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(refreshTokens.tokenHash, hashToken(refreshToken)), isNull(refreshTokens.revokedAt)));
}