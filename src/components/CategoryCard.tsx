import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/products";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/productos"
search={{
  categoria: category.slug,
}}    

className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-200 hover:border-primary hover:shadow-card-hover sm:flex-col sm:items-start sm:p-5"
    >
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-md bg-surface sm:h-auto sm:w-full">
        <img
          src={category.image}
          alt={category.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="aspect-square w-full max-w-[140px] object-contain p-2 transition-transform duration-300 group-hover:scale-[1.05]"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-bold sm:text-lg">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Explorar
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
