import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { mockUser } from "@/mocks/spaces";

// El usuario real vendrá de /api/auth/me; por ahora, dato de ejemplo.
export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar user={mockUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
