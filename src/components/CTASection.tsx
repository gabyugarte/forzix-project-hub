import { Link } from "@tanstack/react-router";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { generalMessages } from "@/lib/whatsapp";

export function CTASection() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          ¿Buscas el herraje adecuado para tu proyecto?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink-foreground/75 sm:text-lg">
          Explora nuestro catálogo y contacta directamente con nuestro equipo para consultar precios
          y disponibilidad.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton message={generalMessages.contacto} size="lg" />
          <Link
            to="/productos"
            className="inline-flex h-14 items-center justify-center rounded-md border-2 border-ink-foreground/25 px-7 text-base font-semibold text-ink-foreground transition-colors hover:border-ink-foreground/60"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
