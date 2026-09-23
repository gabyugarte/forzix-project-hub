import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
}

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [showForm, setShowForm] = useState(false);
const [editingCategory, setEditingCategory] = useState<Category | null>(null);
const [name, setName] = useState("");
const [slug, setSlug] = useState("");
const [description, setDescription] = useState("");
const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error loading categories:", error);
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
        return;
      }

      setCategories(data ?? []);
      setLoading(false);
    }

    loadCategories();
  }, []);

  async function handleCreateCategory() {
  if (!name.trim() || !slug.trim()) {
    setError("El nombre y el identificador son obligatorios.");
    return;
  }

  setSaving(true);
  setError("");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      display_order: categories.length + 1,
      active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    setError(error.message);
    setSaving(false);
    return;
  }

  setCategories((current) => [...current, data]);
  setName("");
  setSlug("");
  setDescription("");
  setShowForm(false);
  setSaving(false);
}

function handleEditCategory(category: Category) {
  setEditingCategory(category);
  setName(category.name);
  setSlug(category.slug);
  setDescription(category.description ?? "");
  setError("");
  setShowForm(true);

  setTimeout(() => {
    document
      .getElementById("category-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 50);
}

async function handleUpdateCategory() {
  if (!editingCategory) {
    return;
  }

  if (!name.trim() || !slug.trim()) {
    setError("El nombre y el identificador son obligatorios.");
    return;
  }

  setSaving(true);
  setError("");

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
    })
    .eq("id", editingCategory.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    setError(error.message);
    setSaving(false);
    return;
  }

  setCategories((current) =>
    current.map((category) =>
      category.id === editingCategory.id ? data : category,
    ),
  );

  setEditingCategory(null);
  setName("");
  setSlug("");
  setDescription("");
  setShowForm(false);
  setSaving(false);
}

async function handleToggleCategory(category: Category) {
  setError("");

  const { data, error } = await supabase
    .from("categories")
    .update({
      active: !category.active,
    })
    .eq("id", category.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category status:", error);
    setError("No se pudo cambiar el estado de la categoría.");
    return;
  }

  setCategories((current) =>
    current.map((item) =>
      item.id === category.id ? data : item,
    ),
  );
}

async function handleDeleteCategory(category: Category) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar la categoría "${category.name}"?`,
  );

  if (!confirmed) {
    return;
  }

  setError("");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", category.id);

  if (error) {
    console.error("Error deleting category:", error);

    if (error.code === "23503") {
      setError(
        "No se puede eliminar esta categoría porque tiene productos asociados.",
      );
    } else {
      setError("No se pudo eliminar la categoría.");
    }

    return;
  }

  setCategories((current) =>
    current.filter((item) => item.id !== category.id),
  );
}

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-surface px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-3 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              ← Volver al panel
            </Link>

            <h1 className="text-3xl font-bold text-foreground">
              Categorías
            </h1>

            <p className="mt-2 text-muted-foreground">
              Gestiona las categorías del catálogo de FORZIX.
            </p>
          </div>

<button
  type="button"
  onClick={() => setShowForm(true)}
  className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
>
  + Nueva categoría
</button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">
            Cargando categorías...
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

{showForm && (
  <div
    id="category-form"
    className="mb-8 scroll-mt-24 rounded-xl border bg-card p-6"
  >
    <div className="mb-6 flex items-center justify-between">
      <div>
<h2 className="text-xl font-semibold text-foreground">
  {editingCategory ? "Editar categoría" : "Nueva categoría"}
</h2>

<p className="mt-1 text-sm text-muted-foreground">
  {editingCategory
    ? "Modifica los datos de esta categoría."
    : "Añade una nueva categoría al catálogo."}
</p>
      </div>

<button
  type="button"
  onClick={() => {
    setShowForm(false);
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setError("");
  }}
  className="text-sm text-muted-foreground hover:text-foreground"
>
  Cancelar
</button>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Nombre
        </label>

<input
  type="text"
  placeholder="Ej. Organizadores"
  value={name}
  onChange={(event) => setName(event.target.value)}
  className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Identificador
        </label>

<input
  type="text"
  placeholder="Ej. organizadores"
  value={slug}
  onChange={(event) => setSlug(event.target.value)}
  className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
/>
      </div>
    </div>

    <div className="mt-5">
      <label className="mb-2 block text-sm font-medium">
        Descripción
      </label>

      <textarea
        rows={3}
        placeholder="Describe brevemente esta categoría..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div className="mt-6 flex justify-end">
<button
  type="button"
  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
  disabled={saving}
  className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving
  ? "Guardando..."
  : editingCategory
    ? "Guardar cambios"
    : "Guardar categoría"}
</button>
    </div>
  </div>
)}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="grid grid-cols-[80px_1fr_140px_120px] gap-4 border-b bg-muted/40 px-6 py-4 text-sm font-semibold">
              <span>Orden</span>
              <span>Categoría</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                className="grid grid-cols-[80px_1fr_140px_120px] items-center gap-4 border-b px-6 py-5 last:border-b-0"
              >
                <span className="text-sm text-muted-foreground">
                  {category.display_order}
                </span>

                <div>
                  <p className="font-semibold text-foreground">
                    {category.name}
                  </p>

<p className="mt-1 text-xs text-muted-foreground">
  Identificador: {category.slug}
</p>
                </div>

<div>
  <span
    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
      category.active
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {category.active ? "Activa" : "Inactiva"}
  </span>

  <button
    type="button"
    onClick={() => handleToggleCategory(category)}
    className="mt-2 block text-xs font-medium text-primary hover:underline"
  >
    {category.active ? "Desactivar" : "Activar"}
  </button>
</div>

<div className="space-y-2">
  <button
    type="button"
    onClick={() => handleEditCategory(category)}
    className="block text-left text-sm font-medium text-primary hover:underline"
  >
    Editar
  </button>

  <button
    type="button"
    onClick={() => handleDeleteCategory(category)}
    className="block text-left text-sm font-medium text-destructive hover:underline"
  >
    Eliminar
  </button>
</div> 

</div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}