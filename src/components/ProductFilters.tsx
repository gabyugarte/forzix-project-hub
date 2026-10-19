
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogCategory } from "@/lib/catalog";
import type { Product } from "@/data/products";

interface CatalogSubcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export type FilterValue = string | "todos";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  category: FilterValue;
  onCategoryChange: (value: FilterValue) => void;
  subcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: CatalogCategory[];
  subcategories: CatalogSubcategory[];
  products: Product[];
}

export function ProductFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  subcategory,
  onSubcategoryChange,
  categories,
  subcategories,
  products,
}: Props) {
  const options: { value: FilterValue; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...categories.map((c) => ({
      value: c.slug,
      label: c.name,
    })),
  ];

  const filteredSubcategories =
    category === "todos"
      ? []
      : subcategories.filter((subcategory) => {
          const selectedCategory = categories.find(
            (item) => item.slug === category,
          );

          return selectedCategory?.id === subcategory.category_id;
        });

  const suggestions =
    query.trim().length >= 2
      ? products
          .filter((product) => {
            const term = query.trim().toLowerCase();

            return (
              product.name.toLowerCase().includes(term) ||
              product.description?.toLowerCase().includes(term) ||
              product.productCode?.toLowerCase().includes(term)
            );
          })
          .slice(0, 5)
      : [];

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />

        <label htmlFor="buscador" className="sr-only">
          ¿Qué herraje estás buscando?
        </label>

        <input
          id="buscador"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="¿Qué herraje estás buscando?"
          className="h-14 w-full rounded-md border border-input bg-card pl-12 pr-4 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onQueryChange(product.name)}
                className="flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {product.name}
                  </p>

                  {product.productCode && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product.productCode}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categorías principales */}
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="-mx-1 flex flex-wrap gap-2 px-1"
      >
        {options.map((option) => {
          const active = option.value === category;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(option.value)}
              className={cn(
                "h-11 rounded-md border px-4 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Subcategorías de la categoría seleccionada */}
      {filteredSubcategories.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Filtrar por subcategoría
          </p>

          <div
            role="group"
            aria-label="Filtrar por subcategoría"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              aria-pressed={subcategory === "todos"}
              onClick={() => onSubcategoryChange("todos")}
              className={cn(
                "h-10 rounded-md border px-4 text-sm font-medium transition-colors",
                subcategory === "todos"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
              )}
            >
              Todas
            </button>

            {filteredSubcategories.map((item) => {
              const active = subcategory === item.slug;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSubcategoryChange(item.slug)}
                  className={cn(
                    "h-10 rounded-md border px-4 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
