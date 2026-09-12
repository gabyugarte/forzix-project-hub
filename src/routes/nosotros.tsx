import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Hammer, MessageCircle, Truck } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { generalMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros | FORZIX Herrajes y Accesorios" },
      {
        name: "description",
        content:
          "Conoce FORZIX: comercialización, importación y distribución de herrajes y accesorios para la fabricación y montaje de muebles en melamina.",
      },
      { property: "og:title", content: "Sobre FORZIX" },
      {
        property: "og:description",
        content:
          "Soluciones funcionales de herrajes y accesorios para fabricantes, carpinteros y proyectos de mobiliario.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/nosotros" },
    ],
    links: [{ rel: "canonical", href: "/nosotros" }],
  }),
  component: NosotrosPage,
});

const values = [
  { icon: Boxes, title: "Variedad de productos" },
  { icon: Hammer, title: "Soluciones para proyectos en melamina" },
  { icon: MessageCircle, title: "Atención directa" },
  { icon: Truck, title: "Distribución en todo el Perú" },
];

function NosotrosPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="section-eyebrow section-eyebrow-line">Empresa</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Sobre FORZIX
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            FORZIX se dedica a la comercialización, importación y distribución de herrajes y
            accesorios destinados a la fabricación y montaje de muebles, ofreciendo soluciones
            funcionales para proyectos en melamina.
          </p>
          <p>
            Buscamos facilitar el acceso a productos prácticos y de calidad para profesionales,
            fabricantes, carpinteros y personas que desarrollan proyectos de mobiliario.
          </p>
          <p>
            Nuestro catálogo reúne bisagras, correderas, pistones, sistemas push open, tiradores y
            accesorios para muebles, con atención directa para consultar precios y disponibilidad.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl font-extrabold sm:text-3xl">
          En qué nos enfocamos
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <li
              key={value.title}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-card"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-accent text-primary">
                <value.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-semibold">{value.title}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <WhatsAppButton message={generalMessages.contacto} size="lg" />
        </div>
      </section>

      <CTASection />
    </>
  );
}
