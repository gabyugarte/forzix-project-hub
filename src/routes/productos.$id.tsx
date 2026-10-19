import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/catalog";
import { productMessage, generalMessages } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CTASection } from "@/components/CTASection";
import bisagras from "@/assets/products/bisagras.jpg";
import correderas from "@/assets/products/correderas.jpg";
import pistones from "@/assets/products/pistones.jpg";
import pushOpen from "@/assets/products/push-open.jpg";
import tiradorBarra from "@/assets/products/tirador-barra.jpg";
import correderaCierreLento from "@/assets/products/corredera-cierre-lento.jpg";


const productImageMap: Record<string, string> = {
  bisagras,
  correderas,
  pistones,
  "push-open": pushOpen,
  "tirador-barra-acero-inoxidable": tiradorBarra,
  "corredera-cierre-lento": correderaCierreLento,
  "corredera-push-open": correderas,
};

export const Route = createFileRoute("/productos/$id")({
  loader: async ({ params }) => {
    const product = await getProductBySlug(params.id);
    if (!product) throw notFound();
    return { product };
  },
head: async ({ loaderData, params }) => {
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
      {
        name: "description",
        content: product.description ?? "",
      },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content: product.description ?? "",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/productos/${params.id}` },
    ],
    links: [
      {
        rel: "canonical",
        href: `/productos/${params.id}`,
      },
    ],
  };
},
  component: ProductoDetalle,
});

function ProductoDetalle() {
  const { product } = Route.useLoaderData();
  
const variants = product.variants ?? [];


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
            src={product.image_url ?? productImageMap[product.slug] ?? "/placeholder.svg"}
            alt={product.name}
            width={1024}
            height={1024}
            className="mx-auto aspect-square w-full max-w-[460px] object-contain"
          />
        </div>

        <div>
          <p className="section-eyebrow">{product.category.name}</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Precio de referencia</dt>
              <dd className="font-display text-2xl font-extrabold">{product.currency} {product.price.toFixed(2)}</dd>
            </div>
            {product.product_code && (
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-muted-foreground">Código de producto</dt>
                <dd className="font-semibold">{product.product_code}</dd>
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
<WhatsAppButton
  message={productMessage(
    product.product_code
      ? {
          name: product.name,
          productCode: product.product_code,
        }
      : {
          name: product.name,
        },
  )}
  size="lg"
  className="w-full sm:w-auto"
>
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

      {variants.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="section-eyebrow">Opciones disponibles</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              Variantes del producto
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Consulta las referencias y características disponibles.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => {
              const attributes = variant.attributes ?? {};
              const image =
                variant.variant_image_url ??
                product.image_url ??
                productImageMap[product.slug] ??
                "/placeholder.svg";

              const variantName =
                variant.name?.trim() || variant.sku;

              return (
                <article
                  key={variant.id}
                  className="overflow-hidden rounded-lg border border-border bg-surface transition hover:shadow-md"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-white p-5">
                    <img
                      src={image}
                      alt={`${product.name} - ${variantName}`}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-extrabold">
                      {variantName}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Referencia: {variant.sku}
                    </p>

                    {attributes.medida && (
                      <p className="mt-3 text-sm">
                        <span className="text-muted-foreground">
                          Medida:{" "}
                        </span>
                        <span className="font-medium">
                          {attributes.medida}
                        </span>
                      </p>
                    )}

                    {attributes.acabado && (
                      <p className="mt-1 text-sm">
                        <span className="text-muted-foreground">
                          Acabado:{" "}
                        </span>
                        <span className="font-medium">
                          {attributes.acabado}
                        </span>
                      </p>
                    )}

                    {attributes.color && (
                      <p className="mt-1 text-sm">
                        <span className="text-muted-foreground">
                          Color:{" "}
                        </span>
                        <span className="font-medium">
                          {attributes.color}
                        </span>
                      </p>
                    )}

                    <div className="mt-4 border-t border-border pt-4">
                      {variant.price !== null &&
                      variant.price !== undefined ? (
                        <p className="font-display text-xl font-extrabold">
                          {variant.currency || product.currency}{" "}
                          {Number(variant.price).toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Consultar precio
                        </p>
                      )}

                      <WhatsAppButton
                        message={productMessage({
                          name: product.name,
                          productCode: variant.sku,
                        })}
                        size="lg"
                        className="mt-4 w-full"
                      >
                        Consultar esta variante
                      </WhatsAppButton>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <CTASection />

    </>
  );
}
