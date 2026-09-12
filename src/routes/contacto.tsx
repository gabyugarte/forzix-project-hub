import { createFileRoute } from "@tanstack/react-router";
import { createFileRoute as _unused } from "@tanstack/react-router";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { business } from "@/config/business";
import { generalMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | FORZIX Herrajes y Accesorios" },
      {
        name: "description",
        content:
          "Contacta con FORZIX por WhatsApp para consultar precios, disponibilidad y cotizaciones de herrajes y accesorios para muebles.",
      },
      { property: "og:title", content: "Contacto | FORZIX" },
      {
        property: "og:description",
        content: "Escríbenos por WhatsApp y consulta precios y disponibilidad de nuestros herrajes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="section-eyebrow section-eyebrow-line">Contacto</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Hablemos de tu proyecto
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            La forma más rápida de contactarnos es por WhatsApp. Cuéntanos qué herrajes necesitas y
            te ayudamos con precios y disponibilidad.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-extrabold">Escríbenos por WhatsApp</h2>
          <div className="mt-6 flex flex-col gap-3">
            <WhatsAppButton message={generalMessages.contacto} size="lg" />
            <WhatsAppButton
              message={generalMessages.cotizacion}
              variant="outline"
              size="lg"
              showIcon={false}
            >
              Solicitar cotización
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

          {/* PLACEHOLDER: los datos reales se configuran en src/config/business.ts */}
          <dl className="mt-10 divide-y divide-border border-t border-border text-sm">
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Empresa</dt>
              <dd className="font-semibold">
                {business.name} — {business.tagline}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Cobertura</dt>
              <dd className="font-semibold">Distribución en todo el {business.country}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold">{business.email || "Por definir"}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
