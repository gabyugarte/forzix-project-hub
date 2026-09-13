import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-forzix-transparente.png";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";

  return (
    <Link
      to="/"
      aria-label="FORZIX Herrajes y Accesorios — Inicio"
      className="inline-flex items-center"
    >
      <span
        className={`inline-flex items-center justify-center overflow-hidden ${
          isLight ? "rounded-md bg-white p-1.5" : ""
        }`}
      >
        <img
          src={logoAsset}
          alt="FORZIX Herrajes y Accesorios"
          className="h-35 w-auto"
        />
      </span>
    </Link>
  );
}