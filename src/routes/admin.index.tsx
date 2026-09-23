import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({

  head: () => ({
    meta: [
      { title: "Administración | FORZIX" },
      {
        name: "description",
        content: "Panel de administración de FORZIX Herrajes y Accesorios.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
      const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        await navigate({ to: "/admin/login" });
        return;
      }

      setCheckingAuth(false);
    }

    checkSession();
  }, [navigate]);
    if (checkingAuth) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface">
        <p className="text-sm text-muted-foreground">
          Comprobando acceso...
        </p>
      </main>
    );
  }
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="section-eyebrow section-eyebrow-line">
            Administración
          </p>

          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
            Panel de administración
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Gestiona las categorías, productos, precios e imágenes de FORZIX
            desde un solo lugar.
          </p>
        </div>

<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <Link
    to="/admin/products"
    className="rounded-lg border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
  >
    <h2 className="font-display text-xl font-extrabold">
      Productos
    </h2>

<p className="mt-2 text-sm text-muted-foreground">
  Ver y gestionar los productos del catálogo.
</p>


  </Link>

  <Link
    to="/admin/categories"
    className="rounded-lg border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
  >
    <h2 className="font-display text-xl font-extrabold">
      Categorías
    </h2>


<p className="mt-2 text-sm text-muted-foreground">
  Crear, editar y gestionar las categorías del catálogo.
</p>


  </Link>

  <Link
    to="/admin/settings"
    className="rounded-lg border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
  >
    <h2 className="font-display text-xl font-extrabold">
      ⚙️ Configuración
    </h2>


<p className="mt-2 text-sm text-muted-foreground">
  Gestionar WhatsApp y otros datos de contacto de FORZIX.
</p>


  </Link>

</div>


        <div className="mt-10">
          <Link
            to="/"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            ← Volver a FORZIX
          </Link>
        </div>
      </div>
    </main>
  );
}