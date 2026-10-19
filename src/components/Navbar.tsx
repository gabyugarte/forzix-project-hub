import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { navLinks } from "@/config/business";
import { generalMessages } from "@/lib/whatsapp";
import { getCategories, getSubcategories } from "@/lib/catalog";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof getCategories>>
  >([]);

  const [subcategories, setSubcategories] = useState<
    Awaited<ReturnType<typeof getSubcategories>>
  >([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCategories(), getSubcategories()])
      .then(([loadedCategories, loadedSubcategories]) => {
        if (!cancelled) {
          setCategories(loadedCategories);
          setSubcategories(loadedSubcategories);
        }
      })
      .catch((error) => {
        console.error("Error loading the product menu:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-0 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex items-center gap-2">
<nav
  aria-label="Navegación principal"
  className="hidden items-center gap-1 lg:flex"
>
  {navLinks
    .filter((link) => link.label !== "Productos")
    .map((link) => (
      <Link
        key={link.to}
        to={link.to}
        activeOptions={{ exact: link.to === "/" }}
        activeProps={{ className: "text-primary" }}
        className="rounded-md px-2 py-1.5 text-lg font-semibold text-foreground transition-colors hover:text-primary"
      >
        {link.label}
      </Link>
    ))}

  <div
    className="relative"
    onMouseEnter={() => setCategoriesOpen(true)}
    onMouseLeave={() => setCategoriesOpen(false)}
  >
    <button
      type="button"
      aria-expanded={categoriesOpen}
      onClick={() => setCategoriesOpen((value) => !value)}
      className="flex items-center gap-1 rounded-md px-2 py-1.5 text-lg font-semibold text-foreground transition-colors hover:text-primary"
    >
      Productos
      <ChevronDown className="h-4 w-4" />
    </button>

    {categoriesOpen && (
      <div className="absolute right-0 top-full z-50 w-80 rounded-lg border border-border bg-background p-3 shadow-xl">
        <Link
          to="/productos"
          search={{}}
          onClick={() => setCategoriesOpen(false)}
          className="mb-2 block rounded-md px-3 py-2 font-semibold text-primary hover:bg-muted"
        >
          Ver todo el catálogo →
        </Link>

        <div className="max-h-[70vh] overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="border-t border-border py-2">
              <Link
                to="/productos"
                search={{ categoria: category.slug }}
                onClick={() => setCategoriesOpen(false)}
                className="block rounded-md px-3 py-2 font-semibold text-foreground hover:bg-muted hover:text-primary"
              >
                {category.name}
              </Link>

              {subcategories
                .filter((subcategory) => subcategory.category_id === category.id)
                .map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to="/productos"
                    search={{
                      categoria: category.slug,
                      subcategoria: subcategory.slug,
                    }}
                    onClick={() => setCategoriesOpen(false)}
                    className="block rounded-md py-1.5 pl-6 pr-3 text-sm text-muted-foreground hover:text-primary"
                  >
                    {subcategory.name}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</nav>

          <WhatsAppButton
            message={generalMessages.contacto}
            size="sm"
            className="hidden sm:inline-flex"
          >
            WhatsApp
          </WhatsAppButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Navegación móvil"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
{navLinks
  .filter((link) => link.label !== "Productos")
  .map((link) => (
    <li key={link.to}>
      <Link
        to={link.to}
        onClick={() => setOpen(false)}
        activeOptions={{ exact: link.to === "/" }}
        activeProps={{ className: "text-primary" }}
        className="block border-b border-border py-4 text-base font-semibold text-foreground last:border-0"
      >
        {link.label}
      </Link>
    </li>
  ))}

<li className="border-b border-border">
  <button
    type="button"
    onClick={() => setMobileCategory((current) => current === "productos" ? null : "productos")}
    aria-expanded={mobileCategory === "productos"}
    className="flex w-full items-center justify-between py-4 text-base font-semibold text-foreground"
  >
    Productos
    <ChevronDown
      className={`h-4 w-4 transition-transform ${mobileCategory === "productos" ? "rotate-180" : ""}`}
    />
  </button>

  {mobileCategory === "productos" && (
    <div className="space-y-1 pb-3">
      <Link
        to="/productos"
        search={{}}
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 font-semibold text-primary hover:bg-muted"
      >
        Ver todo el catálogo
      </Link>

      {categories.map((category) => (
        <div key={category.id}>
          <button
            type="button"
            onClick={() => setMobileCategory((current) => current === category.id ? "productos" : category.id)}
            aria-expanded={mobileCategory === category.id}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left font-semibold text-foreground hover:bg-muted"
          >
            {category.name}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${mobileCategory === category.id ? "rotate-180" : ""}`}
            />
          </button>

          {mobileCategory === category.id && (
            <div className="ml-3 border-l border-border pl-3">
              <Link
                to="/productos"
                search={{ categoria: category.slug }}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-primary"
              >
                Ver todos los productos
              </Link>

              {subcategories
                .filter((subcategory) => subcategory.category_id === category.id)
                .map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to="/productos"
                    search={{
                      categoria: category.slug,
                      subcategoria: subcategory.slug,
                    }}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    {subcategory.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</li>
            <li className="py-4">
              <WhatsAppButton
                message={generalMessages.contacto}
                size="md"
                className="w-full sm:hidden"
              >
                Hablar por WhatsApp
              </WhatsAppButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
