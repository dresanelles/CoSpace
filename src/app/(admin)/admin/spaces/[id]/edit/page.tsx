import { EditSpaceView } from "@/components/admin/edit-space-view";

export default async function EditSpacePage({ params }: PageProps<"/admin/spaces/[id]/edit">) {
  const { id } = await params; // en Next 16 params es una Promise
  return (
    <>
      <h1 className="display mb-8 text-5xl md:text-6xl">
        Editar <span className="accent text-6xl md:text-7xl">espacio</span>
      </h1>
      <EditSpaceView id={id} />
    </>
  );
}
