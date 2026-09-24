import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-forzix.jpg";
import heroImage2 from "@/assets/hero-forzix2.jpg";
import heroImage3 from "@/assets/hero-forzix3.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { business } from "@/config/business";
import { generalMessages } from "@/lib/whatsapp";

const heroImages = [heroImage, heroImage2, heroImage3];

export function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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
            Soluciones prácticas y funcionales para la fabricación y montaje de
            muebles. Descubre nuestro catálogo y encuentra los accesorios que
            necesitas para tus proyectos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/productos"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Ver productos
              <ArrowRight className="h-5 w-5" />
            </Link>

            <WhatsAppButton
              message={generalMessages.contacto}
              variant="outline"
              size="lg"
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border shadow-card">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="Herrajes y accesorios FORZIX para muebles de melamina"
                width={1600}
                height={1200}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                  index === activeImage
                    ? "scale-100 opacity-100"
                    : "scale-[1.03] opacity-0"
                }`}
              />
            ))}

            <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Mostrar imagen ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeImage
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 left-4 hidden rounded-md bg-ink px-5 py-4 shadow-card-hover sm:block">
            <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-foreground">
              Distribución en todo el Perú
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}