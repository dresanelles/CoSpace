import type { ReactNode } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AuthGuard>{children}</AuthGuard>
      </main>
      <Footer />
    </>
  );
}
