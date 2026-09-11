import { Search } from "lucide-react";
import { categories, type CategorySlug } from "@/data/products";
import { cn } from "@/lib/utils";

export type FilterValue = CategorySlug | "todos";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  category: FilterValue;
  onCategoryChange: (value: FilterValue) => void;
}

export function ProductFilters({ query, onQueryChange, category, onCategoryChange }: Props) {
  const options: { value: FilterValue; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...categories.map((c) => ({ value: c.slug as FilterValue, label: c.name })),
  ];

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
      </div>

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
    </div>
  );
}
