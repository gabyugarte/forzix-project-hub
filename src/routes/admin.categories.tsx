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
const [active, setActive] = useState(true);
const [imageUrl, setImageUrl] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState("");
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

function getStoragePathFromPublicUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const marker =
    "/storage/v1/object/public/product-images/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length),
  );
}

function handleImageChange(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    setError("Selecciona un archivo de imagen válido.");
    return;
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
  setError("");
}

async function uploadCategoryImage(
  file: File,
  categoryId: string,
) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `categories/${categoryId}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

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
      active,
      image_url: null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    setError(error.message);
    setSaving(false);
    return;
  }

  let finalCategory = data;

  if (imageFile) {
    try {
      const uploadedImageUrl = await uploadCategoryImage(
        imageFile,
        data.id,
      );

      const { data: updatedCategory, error: imageUpdateError } =
        await supabase
          .from("categories")
          .update({
            image_url: uploadedImageUrl,
          })
          .eq("id", data.id)
          .select()
          .single();

      if (imageUpdateError) {
        console.error(
          "Error saving category image URL:",
          imageUpdateError,
        );

        await supabase
          .from("categories")
          .delete()
          .eq("id", data.id);

        setError("No se pudo guardar la imagen de la categoría.");
        setSaving(false);
        return;
      }

      finalCategory = updatedCategory;
    } catch (imageError) {
      console.error(
        "Error uploading category image:",
        imageError,
      );

      await supabase
        .from("categories")
        .delete()
        .eq("id", data.id);

      setError("No se pudo subir la imagen de la categoría.");
      setSaving(false);
      return;
    }
  }

  setCategories((current) => [...current, finalCategory]);

  setName("");
  setSlug("");
  setDescription("");
  setActive(true);
  setImageUrl("");
  setImageFile(null);
  setImagePreview("");
  setShowForm(false);
  setSaving(false);
}

function handleEditCategory(category: Category) {
  setEditingCategory(category);
  setName(category.name);
  setSlug(category.slug);
  setDescription(category.description ?? "");
  setActive(category.active);
  
  setImageUrl(category.image_url ?? "");
  setImageFile(null);
  setImagePreview(category.image_url ?? "");
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

  let finalImageUrl = editingCategory.image_url;

  if (imageFile) {
    try {
      finalImageUrl = await uploadCategoryImage(
        imageFile,
        editingCategory.id,
      );
} catch (imageError) {
  console.error(
    "Error uploading category image:",
    imageError,
  );

  setError(
    imageError instanceof Error
      ? imageError.message
      : "No se pudo subir la nueva imagen.",
  );

  setSaving(false);
  return;
}
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      active,
      image_url: finalImageUrl,
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

  if (imageFile && editingCategory.image_url) {
    const oldImagePath = getStoragePathFromPublicUrl(
      editingCategory.image_url,
    );

    if (oldImagePath) {
      const { error: deleteOldImageError } =
        await supabase.storage
          .from("product-images")
          .remove([oldImagePath]);

      if (deleteOldImageError) {
        console.error(
          "Error deleting old category image:",
          deleteOldImageError,
        );
      }
    }
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
  setActive(true);
  setImageUrl("");
  setImageFile(null);
  setImagePreview("");
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

    <div className="mt-5">
  <label className="mb-2 block text-sm font-medium">
    Imagen de categoría
  </label>

  <div className="rounded-lg border bg-background p-4">
    {imagePreview && (
      <div className="mb-4">
        <img
          src={imagePreview}
          alt={name || "Vista previa de categoría"}
          className="h-40 w-full rounded-lg object-cover"
        />
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
    />

    <p className="mt-2 text-xs text-muted-foreground">
      JPG, PNG o WebP. Selecciona una nueva imagen para reemplazar la actual.
    </p>
  </div>
</div>
<div className="mt-5">
  <label className="mb-2 block text-sm font-medium">
    Estado
  </label>

  <select
    value={active ? "active" : "inactive"}
    onChange={(event) =>
      setActive(event.target.value === "active")
    }
    className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="active">Activa</option>
    <option value="inactive">Inactiva</option>
  </select>
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
  <>
    {/* Vista móvil */}
    <div className="space-y-4 md:hidden">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-xl border bg-card p-4"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Orden {category.display_order}
            </p>

            <p className="mt-2 break-words text-base font-semibold text-foreground">
              {category.name}
            </p>

            <p className="mt-1 break-all text-xs text-muted-foreground">
              Identificador: {category.slug}
            </p>
          </div>

          {category.description && (
            <div className="mt-4 rounded-lg bg-muted/40 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Descripción
              </p>

              <p className="mt-1 break-words text-sm text-foreground">
                {category.description}
              </p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estado
            </p>

            <span
              className={`mt-1 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                category.active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {category.active ? "Activa" : "Inactiva"}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-5 border-t pt-4">
            <button
              type="button"
              onClick={() => handleEditCategory(category)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => handleDeleteCategory(category)}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Tabla escritorio */}
    <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
      <div className="grid grid-cols-[70px_1fr_180px_120px_130px] gap-4 border-b bg-muted/40 px-6 py-4 text-sm font-semibold">
        <span>Orden</span>
        <span>Categoría</span>
        <span>Identificador</span>
        <span>Estado</span>
        <span>Acciones</span>
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          className="grid grid-cols-[70px_1fr_180px_120px_130px] items-center gap-4 border-b px-6 py-5 last:border-b-0"
        >
          <span className="text-sm text-muted-foreground">
            {category.display_order}
          </span>

          <div>
            <p className="font-semibold text-foreground">
              {category.name}
            </p>

            {category.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>

          <span className="break-all text-sm text-muted-foreground">
            {category.slug}
          </span>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
              category.active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {category.active ? "Activa" : "Inactiva"}
          </span>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleEditCategory(category)}
              className="text-left text-sm font-medium text-primary hover:underline"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => handleDeleteCategory(category)}
              className="text-left text-sm font-medium text-destructive hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
)}
      </div>
    </main>
  );
}