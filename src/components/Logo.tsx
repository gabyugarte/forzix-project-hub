import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-forzix.jpg.asset.json";

/**
 * Logo oficial de FORZIX.
 *
 * El asset se sirve desde Lovable CDN. Para fondos oscuros (variant="light")
 * se envuelve en un fondo blanco para mantener la legibilidad del negro del logo.
 */
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
          src={logoAsset.url}
          alt="FORZIX Herrajes y Accesorios"
          className="h-9 w-auto"
        />
      </span>
    </Link>
  );
}
