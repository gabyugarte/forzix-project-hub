import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { navLinks } from "@/config/business";
import { generalMessages } from "@/lib/whatsapp";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-0 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex items-center gap-2">
          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-2 py-1.5 text-lg font-semibold text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <WhatsAppButton
            message={generalMessages.contacto}
            size="sm"
            className="hidden sm:inline-flex"
          >
            WhatsApp
          </WhatsAppButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Navegación móvil"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="block border-b border-border py-4 text-base font-semibold text-foreground last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-4">
              <WhatsAppButton
                message={generalMessages.contacto}
                size="md"
                className="w-full sm:hidden"
              >
                Hablar por WhatsApp
              </WhatsAppButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
