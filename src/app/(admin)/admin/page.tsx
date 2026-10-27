import { SpaceAdminList } from "@/components/admin/space-admin-list";

export default function AdminPage() {
  return (
    <>
      <h1 className="display text-5xl md:text-7xl">
        Panel <span className="accent text-6xl md:text-8xl">admin</span>
      </h1>
      <SpaceAdminList />
    </>
  );
}
