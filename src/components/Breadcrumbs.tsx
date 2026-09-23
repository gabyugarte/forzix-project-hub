import { Link, useMatch, useRouterState } from "@tanstack/react-router";
import { categoryName } from "@/data/products";
import { ChevronRight, Home } from "lucide-react";


const routeLabels: Record<string, string> = {
  "/": "Inicio",
  "/productos": "Productos",
  "/nosotros": "Nosotros",
  "/distribucion": "Distribución",
  "/contacto": "Contacto",
};

export function Breadcrumbs() {
  const productRoute = useMatch({
  from: "/productos/$id",
  shouldThrow: false,
});
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const search = useRouterState({
    select: (state) => state.location.searchStr,
  });

  // Página de inicio
  if (pathname === "/") {
    return null;
  }

  // Producto individual
  const productMatch = pathname.match(/^\/productos\/([^/]+)$/);

  if (productMatch) {
const productSlug = productMatch[1];

if (!productSlug) {
  return null;
}

const product = productRoute?.loaderData?.product;

if (!product) {
  return null;
}

const category = product.category.name;

    return (
      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <li>
            <Link
              to="/"
              className="group flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4 group-hover:text-primary" />
              <span>Inicio</span>
            </Link>
          </li>

          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-border" />
          </li>

          <li>
            <Link
              to="/productos"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Productos
            </Link>
          </li>

          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-border" />
          </li>

          <li>
            <Link
              to="/productos"
              search={{
  categoria: product.category.slug as
    | "todos"
    | "bisagras"
    | "correderas"
    | "pistones"
    | "push-open"
    | "tiradores"
    | "accesorios",
}}
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {category}
            </Link>
          </li>

          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-border" />
          </li>

          <li>
            <span className="font-semibold text-primary">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>
    );
  }

  // Catálogo de productos y categorías
  if (pathname === "/productos") {
    const params = new URLSearchParams(search);
const categoria = params.get("categoria");

const validCategories = [
  "bisagras",
  "correderas",
  "pistones",
  "push-open",
  "tiradores",
  "accesorios",
] as const;

const category =
  categoria && validCategories.includes(categoria as (typeof validCategories)[number])
    ? categoryName(categoria as (typeof validCategories)[number])
    : null;

    return (
      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <li>
            <Link
              to="/"
              className="group flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4 group-hover:text-primary" />
              <span>Inicio</span>
            </Link>
          </li>

          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-border" />
          </li>

          <li>
            <Link
              to="/productos"
              className={
                category
                  ? "font-medium text-muted-foreground transition-colors hover:text-primary"
                  : "font-semibold text-primary"
              }
            >
              Productos
            </Link>
          </li>

          {category && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4 text-border" />
              </li>

              <li>
                <span className="font-semibold text-primary">
                  {category}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    );
  }

  // Páginas generales
  const label = routeLabels[pathname];

  if (!label) {
    return null;
  }

  return (
    <nav
      aria-label="Migas de pan"
      className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"
    >
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link
            to="/"
            className="group flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4 group-hover:text-primary" />
            <span>Inicio</span>
          </Link>
        </li>

        <li aria-hidden="true">
          <ChevronRight className="h-4 w-4 text-border" />
        </li>

        <li>
          <span className="font-semibold text-primary">{label}</span>
        </li>
      </ol>
    </nav>
  );
}