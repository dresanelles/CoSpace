import { Hero } from "@/components/home/hero";
import { TypeStrip } from "@/components/home/type-strip";

// SSG: no lee datos por petición ni de la base de datos, así se genera en el build.
export default function HomePage() {
  return (
    <>
      <Hero />
      <TypeStrip />
    </>
  );
}
