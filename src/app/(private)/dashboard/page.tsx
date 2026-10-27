import { StatusBadge } from "@/components/ui/tag";

// Placeholder; el dashboard CSR real llega en feat/dashboard.
export default function DashboardPage() {
  return (
    <section className="px-5 py-8 md:px-7">
      <h1 className="display text-6xl">
        Mis <span className="accent">reservas</span>
      </h1>
      <div className="mt-6 flex gap-3">
        <StatusBadge status="confirmed" label="Confirmada" />
        <StatusBadge status="cancelled" label="Cancelada" />
      </div>
    </section>
  );
}
