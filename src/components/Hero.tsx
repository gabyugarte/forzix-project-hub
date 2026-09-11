import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-forzix.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { business } from "@/config/business";
import { generalMessages } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <p className="section-eyebrow section-eyebrow-line">
            {business.name} · {business.tagline}
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Herrajes y accesorios para mejores proyectos
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Soluciones prácticas y funcionales para la fabricación y montaje de muebles. Descubre
            nuestro catálogo y encuentra los accesorios que necesitas para tus proyectos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/productos"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Ver productos
              <ArrowRight className="h-5 w-5" />
            </Link>
            <WhatsAppButton message={generalMessages.contacto} variant="outline" size="lg" />
          </div>
        </div>

        <div className="relative">
          <img
            src={heroImage}
            alt="Muebles de melamina con cajones montados sobre correderas y bisagras"
            width={1600}
            height={1104}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover shadow-card"
          />
          <div className="absolute -bottom-4 left-4 hidden rounded-md bg-ink px-5 py-4 text-ink-foreground shadow-card-hover sm:block">
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em]">
              Distribución en todo el Perú
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
