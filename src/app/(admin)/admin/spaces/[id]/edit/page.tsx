import { EditSpaceView } from "@/components/admin/edit-space-view";

export default async function EditSpacePage({ params }: PageProps<"/admin/spaces/[id]/edit">) {
  const { id } = await params; // en Next 16 params es una Promise
  return <EditSpaceView id={id} />;
}
