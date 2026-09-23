import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { business, navLinks } from "@/config/business";
import { getWhatsappNumber, whatsappLink, generalMessages } from "@/lib/whatsapp";

export function Footer() {
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
      <ul className="mt-5 space-y-2.5 text-sm text-ink-foreground/50">
        <li>Email: {business.email || "por definir"}</li>
        <li>Instagram: {business.social.instagram || "por definir"}</li>
        <li>Facebook: {business.social.facebook || "por definir"}</li>
        <li>TikTok: {business.social.tiktok || "por definir"}</li>
      </ul>
      
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
    </p>
  </div>
</footer>


);
}
