import { Link } from "@tanstack/react-router";
import { categoryName, formatPrice, type Product } from "@/data/products";
import { productMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <Link
        to="/productos/$id"
        params={{ id: product.id }}
        className="block bg-surface p-5"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="mx-auto aspect-square w-full max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          {categoryName(product.category)}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug">
          <Link
            to="/productos/$id"
            params={{ id: product.id }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <span className="font-display text-xl font-extrabold">{formatPrice(product)}</span>
          {product.available && (
            <span className="text-xs font-semibold text-muted-foreground">Disponible</span>
          )}
        </div>

        <WhatsAppButton
          message={productMessage(product)}
          size="sm"
          className="mt-5 w-full"
          showIcon={false}
        >
          Pedir artículo
        </WhatsAppButton>
      </div>
    </article>
  );
}
