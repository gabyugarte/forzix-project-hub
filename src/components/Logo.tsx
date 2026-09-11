import { Link } from "@tanstack/react-router";
import { business } from "@/config/business";

/**
 * LOGO OFICIAL DE FORZIX.
 *
 * Para usar el archivo oficial:
 * 1. Copia el logo en `src/assets/logo-forzix.svg` (o .png).
 * 2. Descomenta el import y el <img> de abajo, y elimina el bloque tipográfico.
 * 3. Copia también el logo en `public/favicon.png` para el favicon.
 *
 * // import logo from "@/assets/logo-forzix.svg";
 * // <img src={logo} alt="FORZIX Herrajes y Accesorios" className="h-9 w-auto" />
 */
export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const main = variant === "dark" ? "text-foreground" : "text-ink-foreground";
  const sub = variant === "dark" ? "text-muted-foreground" : "text-ink-foreground/70";

  return (
    <Link
      to="/"
      aria-label="FORZIX Herrajes y Accesorios — Inicio"
      className="flex items-center gap-2.5"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary font-display text-lg font-extrabold text-primary-foreground">
        F
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`font-display text-lg font-extrabold tracking-tight ${main}`}>
          {business.name}
        </span>
        <span className={`text-[0.65rem] font-medium uppercase tracking-[0.16em] ${sub}`}>
          {business.tagline}
        </span>
      </span>
    </Link>
  );
}
