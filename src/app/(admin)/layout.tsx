import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

// Layout propio de panel (barra lateral + contenido).
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
    </div>
  );
}
