import { ReservationList } from "@/components/reservations/reservation-list";

export default function DashboardPage() {
  return (
    <section className="px-5 py-8 md:px-7">
      <h1 className="display text-5xl md:text-7xl">
        Mis <span className="accent text-6xl md:text-8xl">reservas</span>
      </h1>
      <ReservationList />
    </section>
  );
}
