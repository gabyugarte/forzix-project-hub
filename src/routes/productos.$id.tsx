import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categoryName, formatPrice, getProduct } from "@/data/products";
import { productMessage, generalMessages } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CTASection } from "@/components/CTASection";

export const Route = createFileRoute("/productos/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Producto no disponible | FORZIX" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | FORZIX Herrajes y Accesorios`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/productos/${params.id}` },
      ],
      links: [{ rel: "canonical", href: `/productos/${params.id}` }],
    };
  },
  component: ProductoDetalle,
});

function ProductoDetalle() {
  const { product } = Route.useLoaderData();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-12">
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-10">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="mx-auto aspect-square w-full max-w-[460px] object-contain"
          />
        </div>

        <div>
          <p className="section-eyebrow">{categoryName(product.category)}</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Precio de referencia</dt>
              <dd className="font-display text-2xl font-extrabold">{formatPrice(product)}</dd>
            </div>
            {product.productCode && (
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-muted-foreground">Código de producto</dt>
                <dd className="font-semibold">{product.productCode}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Disponibilidad</dt>
              <dd className="font-semibold">
                {product.available ? "Consultar disponibilidad" : "No disponible"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message={productMessage(product)} size="lg" className="w-full sm:w-auto">
              Pedir por WhatsApp
            </WhatsAppButton>
            <WhatsAppButton
              message={generalMessages.cotizacion}
              variant="outline"
              size="lg"
              showIcon={false}
              className="w-full sm:w-auto"
            >
              Solicitar cotización
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
