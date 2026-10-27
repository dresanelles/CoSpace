import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { db } from "./index";
import { spaces, users, type NewSpace } from "./schema";

const ADMIN_EMAIL = "admin@cospace.com";
const ADMIN_NAME = "Administrador";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

const SPACES: NewSpace[] = [
  {
    name: "Mesa Ceiba",
    description: "Escritorio junto a la ventana con luz natural.",
    type: "desk",
    capacity: 1,
    pricePerHour: 8000,
    imageUrl: "/img/spaces/escritorio.jpg",
    amenities: ["Ventana", "WiFi 1 GB"],
  },
  {
    name: "Mesa Roble",
    description: "Puesto fijo con monitor y silla ergonómica.",
    type: "desk",
    capacity: 1,
    pricePerHour: 9000,
    imageUrl: "/img/spaces/escritorio.jpg",
    amenities: ["Monitor 27\"", "Silla ergonómica"],
  },
  {
    name: "Mesa Cedro",
    description: "Escritorio tranquilo con tomas USB-C.",
    type: "desk",
    capacity: 1,
    pricePerHour: 7000,
    imageUrl: "/img/spaces/escritorio.jpg",
    amenities: ["Tomas USB-C", "WiFi 1 GB"],
  },
  {
    name: "Sala Guadua",
    description: "Sala luminosa para equipos pequeños, con pantalla y tablero.",
    type: "meeting_room",
    capacity: 8,
    pricePerHour: 45000,
    imageUrl: "/img/spaces/sala-grande.jpg",
    amenities: ["Pantalla", "WiFi 1 GB", "Café"],
  },
  {
    name: "Sala Bambú",
    description: "Sala íntima para reuniones y talleres cortos.",
    type: "meeting_room",
    capacity: 4,
    pricePerHour: 28000,
    imageUrl: "/img/spaces/sala.jpg",
    amenities: ["Pantalla", "Pizarra"],
  },
  {
    name: "Sala Yarumo",
    description: "Sala amplia con videoconferencia para presentaciones.",
    type: "meeting_room",
    capacity: 12,
    pricePerHour: 65000,
    imageUrl: "/img/spaces/sala-grande.jpg",
    amenities: ["Proyector", "Videoconferencia", "Café"],
  },
  {
    name: "Cabina Silencio",
    description: "Cabina insonorizada para llamadas y trabajo profundo.",
    type: "cabin",
    capacity: 1,
    pricePerHour: 18000,
    imageUrl: "/img/spaces/cabina.jpg",
    amenities: ["Insonorizada", "WiFi 1 GB"],
  },
  {
    name: "Cabina Eco",
    description: "Cabina doble para entrevistas o reuniones uno a uno.",
    type: "cabin",
    capacity: 2,
    pricePerHour: 24000,
    imageUrl: "/img/spaces/cabina.jpg",
    amenities: ["Insonorizada", "Pantalla"],
  },
];

async function seedAdmin(): Promise<void> {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("Admin ya existe, se omite.");
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.insert(users).values({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    passwordHash,
    role: "admin",
  });
  console.log(`Admin creado: ${ADMIN_EMAIL}`);
}

async function seedSpaces(): Promise<void> {
  const rows = await db.select({ total: count() }).from(spaces);
  const total = rows[0]?.total ?? 0;

  if (total > 0) {
    console.log(`Ya hay ${total} espacios, se omite.`);
    return;
  }

  await db.insert(spaces).values(SPACES);
  console.log(`${SPACES.length} espacios creados.`);
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedSpaces();
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });