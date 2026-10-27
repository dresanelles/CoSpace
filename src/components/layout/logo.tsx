import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-[26px] font-extrabold leading-none tracking-tight"
      style={{ fontVariationSettings: '"wdth" 75' }}
    >
      cospace*
    </Link>
  );
}
