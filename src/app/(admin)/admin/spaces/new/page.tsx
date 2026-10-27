import { CreateSpaceView } from "@/components/admin/create-space-view";

export default function NewSpacePage() {
  return (
    <>
      <h1 className="display mb-8 text-5xl md:text-6xl">
        Nuevo <span className="accent text-6xl md:text-7xl">espacio</span>
      </h1>
      <CreateSpaceView />
    </>
  );
}
