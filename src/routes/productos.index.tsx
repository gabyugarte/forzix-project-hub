import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProductFilters, type FilterValue } from "@/components/ProductFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { CTASection } from "@/components/CTASection";
import {
  getProducts,
  getCategories,
  getSubcategories,
} from "@/lib/catalog";
import type { Product } from "@/data/products";

import bisagras from "@/assets/products/bisagras.jpg";
import correderas from "@/assets/products/correderas.jpg";
import pistones from "@/assets/products/pistones.jpg";
import pushOpen from "@/assets/products/push-open.jpg";
import tiradorBarra from "@/assets/products/tirador-barra.jpg";
import correderaCierreLento from "@/assets/products/corredera-cierre-lento.jpg";

const searchSchema = z.object({
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
});

export const Route = createFileRoute("/productos/")({
  validateSearch: searchSchema,

  loader: async () => {
const [catalogProducts, categories, subcategories] = await Promise.all([
  getProducts(),
  getCategories(),
  getSubcategories(),
]);

    const imageMap: Record<string, string> = {
      bisagras,
      correderas,
      pistones,
      "push-open": pushOpen,
      "tirador-barra-acero-inoxidable": tiradorBarra,
      "corredera-cierre-lento": correderaCierreLento,
      "corredera-push-open": correderas,
    };

const products: Product[] = catalogProducts.map((product) => ({
  id: product.slug,
  name: product.name,
  category: product.category.slug as Product["category"],
  subcategory: product.subcategory?.slug ?? "",
  description: product.description ?? "",
  price: product.price,
  currency: product.currency,
  image:
  product.image_url?.trim() ||
  imageMap[product.slug] ||
  correderas,
  ...(product.product_code
    ? { productCode: product.product_code }
    : {}),
  available: product.available,
}));

    return { products, categories, subcategories };
  },

  head: () => ({
    meta: [
      { title: "Productos | FORZIX Herrajes y Accesorios" },
      {
        name: "description",
        content:
          "Catálogo de herrajes y accesorios FORZIX: bisagras, correderas, pistones, sistemas push open, tiradores y accesorios para muebles de melamina.",
      },
      { property: "og:title", content: "Catálogo de herrajes | FORZIX" },
      {
        property: "og:description",
        content:
          "Busca y filtra herrajes y accesorios para muebles. Consulta precios y disponibilidad por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/productos" },
    ],
    links: [{ rel: "canonical", href: "/productos" }],
  }),

  component: ProductosPage,
});

function ProductosPage() {
  const { categoria, subcategoria: subcategoriaURL } = Route.useSearch();
  const { products, categories, subcategories } = Route.useLoaderData();

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState<FilterValue>(
    categoria ?? "todos",
  );

  const [subcategory, setSubcategory] = useState<string>(
    subcategoriaURL ?? "todos",
  );

  useEffect(() => {
  setCategory(categoria ?? "todos");
  setSubcategory(subcategoriaURL ?? "todos");
}, [categoria, subcategoriaURL]);

const navigate = Route.useNavigate();

const handleCategoryChange = (value: FilterValue) => {
  setCategory(value);
  setSubcategory("todos");

  navigate({
    search: (prev) => ({
      ...prev,
      categoria: value === "todos" ? undefined : value,
      subcategoria: undefined,
    }),
    replace: true,
  });
};

const handleSubcategoryChange = (value: string) => {
  setSubcategory(value);

  navigate({
    search: (prev) => ({
      ...prev,
      subcategoria: value === "todos" ? undefined : value,
    }),
    replace: true,
  });
};

const filtered = useMemo(() => {
  const term = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchCategory =
      category === "todos" || product.category === category;

    const matchSubcategory =
      subcategory === "todos" ||
      product.subcategory === subcategory;

    const matchQuery =
      term === "" ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.productCode?.toLowerCase().includes(term);

    return matchCategory && matchSubcategory && matchQuery;
  });
}, [products, query, category, subcategory]);


  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="section-eyebrow section-eyebrow-line">Catálogo</p>

          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Nuestros productos
          </h1>

          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Herrajes y accesorios para la fabricación y montaje de muebles.
            Encuentra lo que necesitas y consúltanos precio y disponibilidad
            por WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
<ProductFilters
  query={query}
  onQueryChange={setQuery}
  category={category}
  onCategoryChange={handleCategoryChange}
  subcategory={subcategory}
  onSubcategoryChange={handleSubcategoryChange}
  categories={categories}
  subcategories={subcategories}
  products={products}
/>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "producto" : "productos"}
        </p>

        <div className="mt-6">
          <ProductGrid products={filtered} />
        </div>
      </section>

      <CTASection />
    </>
  );
}