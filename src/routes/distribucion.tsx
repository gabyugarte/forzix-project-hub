import { createFileRoute } from "@tanstack/react-router";
import { CTASection } from "@/components/CTASection";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PeruMap } from "@/routes/index";
import { generalMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/distribucion")({
  head: () => ({
    meta: [
      { title: "Distribución en todo el Perú | FORZIX" },
      {
        name: "description",
        content:
          "FORZIX lleva herrajes y accesorios para muebles a clientes y profesionales en diferentes puntos del Perú. Consulta por WhatsApp.",
      },
      { property: "og:title", content: "Distribución en todo el Perú | FORZIX" },
      {
        property: "og:description",
        content:
          "Distribuimos herrajes y accesorios para la fabricación y montaje de muebles en todo el Perú.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/distribucion" },
    ],
    links: [{ rel: "canonical", href: "/distribucion" }],
  }),
  component: DistribucionPage,
});

function DistribucionPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="section-eyebrow section-eyebrow-line">Cobertura</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Distribuimos en todo el Perú
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Llevamos nuestros productos a clientes y profesionales en diferentes puntos del Perú.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <PeruMap />
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Consulta el envío a tu zona
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Escríbenos por WhatsApp indicando los productos que necesitas y tu ubicación. Te
            responderemos con la información de precio, disponibilidad y envío correspondiente.
          </p>
          {/* PENDIENTE: incorporar aquí tiempos de entrega, costos de envío,
              ciudades y empresas de transporte cuando la empresa los defina. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message={generalMessages.distribucion} size="lg">
              Consultar por WhatsApp
            </WhatsAppButton>
            <WhatsAppButton
              message={generalMessages.disponibilidad}
              variant="outline"
              size="lg"
              showIcon={false}
            >
              Consultar disponibilidad
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
