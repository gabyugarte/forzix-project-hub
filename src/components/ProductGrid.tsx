import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-14 text-center text-muted-foreground">
        No encontramos productos con esa búsqueda. Prueba con otro término o consúltanos por
        WhatsApp.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
