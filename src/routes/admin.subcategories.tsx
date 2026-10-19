
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
}

const emptyForm = {
  category_id: "",
  name: "",
  slug: "",
  description: "",
  display_order: "0",
  active: true,
};

export const Route = createFileRoute("/admin/subcategories")({
  head: () => ({
    meta: [
      { title: "Subcategorías | FORZIX" },
      {
        name: "description",
        content: "Gestiona las subcategorías de FORZIX.",
      },
    ],
  }),
  component: AdminSubcategoriesPage,
});

function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    setLoading(true);
    setError("");

    const [categoriesResult, subcategoriesResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name")
        .order("display_order", { ascending: true }),

      supabase
        .from("subcategories")
        .select(
          "id, category_id, name, slug, description, image_url, active, display_order",
        )
        .order("display_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (categoriesResult.error || subcategoriesResult.error) {
      console.error("Error cargando categorías:", categoriesResult.error);
      console.error("Error cargando subcategorías:", subcategoriesResult.error);
      setError(
        categoriesResult.error
          ? `Error al cargar categorías: ${categoriesResult.error.message}`
          : `Error al cargar subcategorías: ${subcategoriesResult.error?.message}`,
      );
      setLoading(false);
      return;
    }

    setCategories(categoriesResult.data ?? []);
    setSubcategories(subcategoriesResult.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  function updateField<K extends keyof typeof emptyForm>(
    field: K,
    value: (typeof emptyForm)[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function makeSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function startCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      category_id: selectedCategory === "all" ? "" : selectedCategory,
      display_order: "1",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function startEdit(subcategory: Subcategory) {
    setEditing(subcategory);
    setForm({
      category_id: subcategory.category_id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description ?? "",
      display_order: String(subcategory.display_order),
      active: subcategory.active,
    });
    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!form.category_id) {
      setError("Selecciona una categoría.");
      return;
    }

    if (!form.name.trim()) {
      setError("El nombre de la subcategoría es obligatorio.");
      return;
    }

    const finalSlug = makeSlug(form.slug || form.name);

    if (!finalSlug) {
      setError("Escribe un nombre o identificador válido.");
      return;
    }

    const order = Number(form.display_order);

    if (!Number.isInteger(order) || order < 0) {
      setError("El orden debe ser un número entero igual o mayor que 0.");
      return;
    }

    setSaving(true);

    const payload = {
      category_id: form.category_id,
      name: form.name.trim(),
      slug: finalSlug,
      description: form.description.trim() || null,
      display_order: order,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    const result = editing
      ? await supabase
          .from("subcategories")
          .update(payload)
          .eq("id", editing.id)
          .select(
            "id, category_id, name, slug, description, image_url, active, display_order",
          )
          .single()
      : await supabase
          .from("subcategories")
          .insert(payload)
          .select(
            "id, category_id, name, slug, description, image_url, active, display_order",
          )
          .single();

    if (result.error) {
      console.error("Error guardando subcategoría:", result.error);

      if (result.error.code === "23505") {
        setError(
          "Ya existe una subcategoría con ese identificador o nombre en esa categoría.",
        );
      } else if (result.error.code === "42501") {
        setError(
          "No tienes permisos para guardar cambios. Comprueba que has iniciado sesión como administrador.",
        );
      } else {
        setError(`No se pudo guardar: ${result.error.message}`);
      }

      setSaving(false);
      return;
    }

    if (editing) {
      setSubcategories((current) =>
        current.map((item) => (item.id === result.data.id ? result.data : item)),
      );
      setSuccess("Subcategoría actualizada correctamente.");
    } else {
      setSubcategories((current) => [...current, result.data]);
      setSuccess("Subcategoría creada correctamente.");
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setSaving(false);
  }

  async function toggleActive(subcategory: Subcategory) {
    setError("");
    setSuccess("");

    const { data, error: updateError } = await supabase
      .from("subcategories")
      .update({
        active: !subcategory.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subcategory.id)
      .select(
        "id, category_id, name, slug, description, image_url, active, display_order",
      )
      .single();

    if (updateError) {
      console.error("Error cambiando estado:", updateError);
      setError(`No se pudo cambiar el estado: ${updateError.message}`);
      return;
    }

    setSubcategories((current) =>
      current.map((item) => (item.id === data.id ? data : item)),
    );
    setSuccess(
      data.active
        ? "Subcategoría activada."
        : "Subcategoría desactivada.",
    );
  }

  async function handleDelete(subcategory: Subcategory) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${subcategory.name}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", subcategory.id);

    if (deleteError) {
      console.error("Error eliminando subcategoría:", deleteError);

      if (deleteError.code === "23503") {
        setError(
          "No se puede eliminar porque hay productos vinculados. Primero cambia su subcategoría desde la gestión de productos.",
        );
      } else if (deleteError.code === "42501") {
        setError(
          "No tienes permisos para eliminar. Comprueba que has iniciado sesión como administrador.",
        );
      } else {
        setError(`No se pudo eliminar: ${deleteError.message}`);
      }

      return;
    }

    setSubcategories((current) =>
      current.filter((item) => item.id !== subcategory.id),
    );
    setSuccess("Subcategoría eliminada correctamente.");
  }

  const filteredSubcategories =
    selectedCategory === "all"
      ? subcategories
      : subcategories.filter(
          (subcategory) => subcategory.category_id === selectedCategory,
        );

  function getCategoryName(categoryId: string) {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Categoría no encontrada"
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-surface px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver al panel
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Subcategorías
            </h1>
            <p className="mt-2 text-muted-foreground">
              Organiza las familias de productos de FORZIX.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            + Nueva subcategoría
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {success}
          </p>
        )}

        {showForm && (
          <section className="mt-8 rounded-xl border bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">
                {editing ? "Editar subcategoría" : "Nueva subcategoría"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="subcategory-category"
                  className="mb-2 block text-sm font-medium"
                >
                  Categoría *
                </label>
                <select
                  id="subcategory-category"
                  value={form.category_id}
                  onChange={(event) =>
                    updateField("category_id", event.target.value)
                  }
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="subcategory-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Nombre *
                </label>
                <input
                  id="subcategory-name"
                  value={form.name}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm((current) => ({
                      ...current,
                      name: value,
                      slug: editing
                        ? current.slug
                        : makeSlug(value),
                    }));
                  }}
                  placeholder="Ej. Correderas telescópicas"
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="subcategory-slug"
                  className="mb-2 block text-sm font-medium"
                >
                  Identificador (slug) *
                </label>
                <input
                  id="subcategory-slug"
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value)
                  }
                  placeholder="correderas-telescopicas"
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Se genera automáticamente a partir del nombre; puedes
                  modificarlo.
                </p>
              </div>

              <div>
                <label
                  htmlFor="subcategory-order"
                  className="mb-2 block text-sm font-medium"
                >
                  Orden de visualización
                </label>
                <input
                  id="subcategory-order"
                  type="number"
                  min="0"
                  step="1"
                  value={form.display_order}
                  onChange={(event) =>
                    updateField("display_order", event.target.value)
                  }
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="subcategory-description"
                  className="mb-2 block text-sm font-medium"
                >
                  Descripción (opcional)
                </label>
                <textarea
                  id="subcategory-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe esta familia de productos..."
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    updateField("active", event.target.checked)
                  }
                />
                Subcategoría activa
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving
                  ? "Guardando..."
                  : editing
                    ? "Guardar cambios"
                    : "Crear subcategoría"}
              </button>
            </div>
          </section>
        )}

        <div className="mt-7 max-w-sm">
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium"
          >
            Filtrar por categoría
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Cargando subcategorías...
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border bg-card">
            <div className="border-b bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
              {filteredSubcategories.length} subcategorías
            </div>

            {filteredSubcategories.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No hay subcategorías para mostrar.
              </p>
            ) : (
              <div className="divide-y">
                {filteredSubcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-foreground">
                        {subcategory.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {getCategoryName(subcategory.category_id)} ·{" "}
                        {subcategory.slug}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Orden {subcategory.display_order}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          subcategory.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {subcategory.active ? "Activa" : "Inactiva"}
                      </span>

                      <button
                        type="button"
                        onClick={() => startEdit(subcategory)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleActive(subcategory)}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {subcategory.active ? "Desactivar" : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(subcategory)}
                        className="text-sm font-medium text-destructive hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
