import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Hammer, MessageCircle, Truck } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { CTASection } from "@/components/CTASection";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { categories, products } from "@/data/products";
import { generalMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FORZIX | Herrajes y Accesorios para Muebles" },
      {
        name: "description",
        content:
          "FORZIX comercializa, importa y distribuye herrajes y accesorios para la fabricación y montaje de muebles en melamina, con distribución en todo el Perú.",
      },
      { property: "og:title", content: "FORZIX | Herrajes y Accesorios para Muebles" },
      {
        property: "og:description",
        content:
          "Herrajes y accesorios para proyectos de mobiliario en melamina. Consulta precios y disponibilidad por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Boxes,
    title: "Variedad de productos",
    text: "Bisagras, correderas, pistones, sistemas push open, tiradores y accesorios en un mismo lugar.",
  },
  {
    icon: Hammer,
    title: "Soluciones para melamina",
    text: "Productos pensados para la fabricación y el montaje de muebles en melamina.",
  },
  {
    icon: MessageCircle,
    title: "Atención directa",
    text: "Consulta precios y disponibilidad hablando directamente con nuestro equipo.",
  },
  {
    icon: Truck,
    title: "Distribución nacional",
    text: "Llevamos nuestros productos a clientes y profesionales en todo el Perú.",
  },
];

function Index() {
  const featured = products.slice(0, 6);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="section-eyebrow section-eyebrow-line">Categorías</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
          Encuentra lo que necesitas
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="section-eyebrow section-eyebrow-line">Catálogo</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                Nuestros productos
              </h2>
            </div>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ver todo el catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="section-eyebrow section-eyebrow-line">Sobre FORZIX</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Herrajes y accesorios para quienes fabrican muebles
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              FORZIX se dedica a la comercialización, importación y distribución de herrajes y
              accesorios destinados a la fabricación y montaje de muebles, con soluciones
              funcionales para proyectos en melamina.
            </p>
            <p>
              Buscamos facilitar el acceso a productos prácticos y de calidad para profesionales,
              fabricantes, carpinteros y personas que desarrollan sus propios proyectos de
              mobiliario.
            </p>
            <Link
              to="/nosotros"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Conocer más sobre FORZIX
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="section-eyebrow section-eyebrow-line">Ventajas</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">¿Por qué FORZIX?</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-lg border border-border bg-card p-6 shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent text-primary">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="section-eyebrow section-eyebrow-line">Distribución</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Distribuimos en todo el Perú
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Llevamos nuestros productos a clientes y profesionales en diferentes puntos del Perú.
            </p>
            <div className="mt-8">
              <WhatsAppButton message={generalMessages.distribucion} size="lg">
                Consultar por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
          <PeruMap />
        </div>
      </section>

      <CTASection />
    </>
  );
}

/** Mapa estilizado del Perú, sin datos inventados de cobertura. */
export function PeruMap() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <svg
        viewBox="0 0 300 380"
        role="img"
        aria-label="Silueta estilizada del Perú"
        className="mx-auto h-auto w-full max-w-[280px]"
      >
        <path
          d="M96 12 128 30 150 22 170 40 196 44 214 68 236 84 252 118 240 140 250 166 236 190 210 206 200 232 178 252 168 286 150 314 128 344 110 366 92 352 100 322 84 296 92 268 72 246 62 214 44 190 52 160 40 132 56 104 50 74 70 52 78 26Z"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {[
          [120, 90],
          [160, 150],
          [110, 210],
          [150, 268],
          [190, 110],
          [96, 300],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="var(--color-primary)" />
        ))}
      </svg>
    </div>
  );
}
