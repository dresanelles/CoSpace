/** Error general del formulario (credenciales incorrectas, correo ocupado...). */
export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
      {message}
    </p>
  );
}
