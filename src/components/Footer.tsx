import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { business, navLinks } from "@/config/business";
import { getWhatsappNumber, whatsappLink, generalMessages } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.75V3.94c-.3-.04-1.32-.13-2.51-.13-2.48 0-4.19 1.51-4.19 4.28V10H7.25v3H10v8h3.5Z" />
    </svg>
  );
}
export function Footer() {
const [email, setEmail] = useState("");
const [instagram, setInstagram] = useState("");
const [facebook, setFacebook] = useState("");
  useEffect(() => {
    async function loadContactSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("email, instagram, facebook")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error cargando datos de contacto:", error);
        return;
      }

      if (data) {
        setEmail(data.email ?? "");
        setInstagram(data.instagram ?? "");
        setFacebook(data.facebook ?? "");
      }
    }

    loadContactSettings();
  }, []);
async function handleWhatsAppClick() {
const whatsappNumber = await getWhatsappNumber();
const url = whatsappLink(whatsappNumber, generalMessages.contacto);


window.open(url, "_blank", "noopener,noreferrer");


}

return ( <footer className="bg-ink text-ink-foreground"> <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8"> <div> <Logo variant="light" /> <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">
Herrajes y accesorios para la fabricación y montaje de muebles. </p> <p className="mt-2 text-sm font-semibold">Distribución en todo el Perú</p> </div>


    <nav aria-label="Enlaces del sitio">
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em]">
        Navegación
      </h2>
      <ul className="mt-4 space-y-2.5">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em]">
        Contacto
      </h2>

      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground transition-colors hover:text-primary-foreground/80"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </button>

      {/* PLACEHOLDER: añadir email y redes sociales reales en src/config/business.ts */}
<div className="mt-5 space-y-2.5 text-sm text-ink-foreground/50">
  {email && (
    <a
      href={`mailto:${email}`}
      className="block transition-colors hover:text-ink-foreground"
    >
      Email: {email}
    </a>
  )}

<div className="flex items-center gap-3">
  {instagram && (
    <a
      href={instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram de FORZIX"
      title="Instagram"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-foreground/40 hover:text-ink-foreground"
    >
      <InstagramIcon className="h-5 w-5" />
    </a>
  )}

  {facebook && (
    <a
      href={facebook}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook de FORZIX"
      title="Facebook"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-foreground/40 hover:text-ink-foreground"
    >
      <FacebookIcon className="h-5 w-5" />
    </a>
  )}
</div>
</div>
      
      <div className="mt-6">
  <Link
    to="/admin/login"
    className="text-xs text-ink-foreground/30 transition-colors hover:text-ink-foreground/60"
  >
    🔐 Acceso administrador
  </Link>
</div>
    </div>
  </div>

  <div className="border-t border-ink-foreground/10">
<p className="mx-auto max-w-7xl px-4 py-6 text-xs text-ink-foreground/50 sm:px-6 lg:px-8">
  © {new Date().getFullYear()} {business.name} — {business.tagline}
  {" · "}
  Sitio web desarrollado por{" "}
  <a
    href="https://gabyugarte.github.io/"
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-ink-foreground/70 transition-colors hover:text-ink-foreground"
  >
    Gabriela Ugarte M.
  </a>
</p>
  </div>
</footer>


);
}
