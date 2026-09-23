import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  product_code: string | null;
  available: boolean;
  featured: boolean;
  display_order: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<
  { id: string; name: string; slug: string }[]
>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);

const [name, setName] = useState("");
const [slug, setSlug] = useState("");
const [productCode, setProductCode] = useState("");
const [categoryId, setCategoryId] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [currency, setCurrency] = useState("S/");
const [available, setAvailable] = useState(true);
const [featured, setFeatured] = useState(false);
const [displayOrder, setDisplayOrder] = useState("0");
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(
          id,
          name,
          slug
        )
      `)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading products:", error);
      setError("No se pudieron cargar los productos.");
      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  }

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
      setError("No se pudieron cargar las categorías.");
      return;
    }


setCategories(data ?? []);
  }

  loadProducts();
  loadCategories();
}, []);

function handleEditProduct(product: Product) {
  setEditingProduct(product);
  setImageFile(null);
  setImagePreview(product.image_url);
  setName(product.name);
  setSlug(product.slug);
  setProductCode(product.product_code ?? "");
  setCategoryId(product.category_id);
  setDescription(product.description ?? "");
  setPrice(String(product.price));
  setCurrency(product.currency);
  setAvailable(product.available);
  setFeatured(product.featured);
  setDisplayOrder(String(product.display_order));

  setError("");
  setShowForm(true);

  setTimeout(() => {
    document
      .getElementById("product-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 50);
}

async function handleDeleteProduct(product: Product) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar "${product.name}"?`
  );

  if (!confirmed) {
    return;
  }

  setError("");
  const imagePath = getStoragePathFromPublicUrl(
  product.image_url,
);

if (imagePath) {

const { error: deleteImageError } = await supabase.storage
  .from("product-images")
  .remove([imagePath]);

  if (deleteImageError) {
    console.error(
      "Error eliminando la imagen del producto:",
      deleteImageError,
    );
    setError(
      "No se pudo eliminar la imagen del producto. El producto no se ha eliminado.",
    );
    return;
  }
}

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    console.error("Error deleting product:", error);
    setError(
      "No se pudo eliminar el producto. Inténtalo de nuevo."
    );
    return;
  }

  setProducts((currentProducts) =>
    currentProducts.filter(
      (currentProduct) => currentProduct.id !== product.id
    )
  );

  if (editingProduct?.id === product.id) {
    setEditingProduct(null);
    setShowForm(false);
  }
}

function getStoragePathFromPublicUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const marker = "/storage/v1/object/public/product-images/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length),
  );
}

async function handleSaveProduct() {
  setError("");

  if (!name.trim()) {
    setError("El nombre del producto es obligatorio.");
    return;
  }

  if (!slug.trim()) {
    setError("El identificador del producto es obligatorio.");
    return;
  }

  if (!categoryId) {
    setError("Debes seleccionar una categoría.");
    return;
  }

  if (!price.trim()) {
    setError("El precio es obligatorio.");
    return;
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    setError("El precio debe ser un número válido igual o mayor que 0.");
    return;
  }

  const numericDisplayOrder = Number(displayOrder);

  if (
    Number.isNaN(numericDisplayOrder) ||
    numericDisplayOrder < 0
  ) {
    setError(
      "El orden de visualización debe ser un número igual o mayor que 0."
    );
    return;
  }

setSaving(true);

let imageUrl: string | null = editingProduct?.image_url ?? null;
const previousImageUrl = editingProduct?.image_url ?? null;

if (imageFile) {
  const fileExtension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    setError("No se pudo subir la imagen. Inténtalo de nuevo.");
    setSaving(false);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  imageUrl = publicUrlData.publicUrl;
  if (previousImageUrl) {
  const previousImagePath =
    getStoragePathFromPublicUrl(previousImageUrl);

  if (previousImagePath) {
    const { error: deleteImageError } = await supabase.storage
      .from("product-images")
      .remove([previousImagePath]);

    if (deleteImageError) {
      console.error(
        "Error eliminando la imagen anterior:",
        deleteImageError,
      );
    }
  }
}
}

const productData = {
  name: name.trim(),
  slug: slug.trim(),
  product_code: productCode.trim() || null,
  category_id: categoryId,
  description: description.trim() || null,
  price: numericPrice,
  currency,
  image_url: imageUrl,
  available,
  featured,
  display_order: numericDisplayOrder,
};

  if (editingProduct) {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", editingProduct.id)
      .select(`
        *,
        category:categories(
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error("Error updating product:", error);

      if (error.code === "23505") {
        setError(
          "Ya existe otro producto con ese identificador o código de producto."
        );
      } else {
        setError(
          "No se pudo actualizar el producto. Inténtalo de nuevo."
        );
      }

      setSaving(false);
      return;
    }

    if (data) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === data.id ? data : product
        )
      );
    }
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select(`
        *,
        category:categories(
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error("Error creating product:", error);

      if (error.code === "23505") {
        setError(
          "Ya existe un producto con ese identificador o código de producto."
        );
      } else {
        setError(
          "No se pudo guardar el producto. Inténtalo de nuevo."
        );
      }

      setSaving(false);
      return;
    }

    if (data) {
      setProducts((currentProducts) => [
        ...currentProducts,
        data,
      ]);
    }
  }

  setName("");
  setSlug("");
  setProductCode("");
  setCategoryId("");
  setDescription("");
  setPrice("");
  setCurrency("S/");
  setAvailable(true);
  setFeatured(false);
  setDisplayOrder("0");
  setImageFile(null);
  setImagePreview(null);

  setEditingProduct(null);
  setShowForm(false);
  setSaving(false);
}
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-surface px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-3 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              ← Volver al panel
            </Link>

            <h1 className="text-3xl font-bold text-foreground">
              Productos
            </h1>

            <p className="mt-2 text-muted-foreground">
              Gestiona los productos del catálogo de FORZIX.
            </p>
          </div>

<button
  type="button"
  onClick={() => setShowForm(true)}
  className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
>
  + Nuevo producto
</button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">
            Cargando productos...
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

{showForm && (
  <div
    id="product-form"
    className="mb-8 scroll-mt-24 rounded-xl border bg-card p-6"
  >
    <div className="mb-6 flex items-center justify-between">
      <div>
<h2 className="text-xl font-semibold text-foreground">
  {editingProduct ? "Editar producto" : "Nuevo producto"}
</h2>

<p className="mt-1 text-sm text-muted-foreground">
  {editingProduct
    ? "Modifica los datos del producto."
    : "Añade un nuevo producto al catálogo de FORZIX."}
</p>
      </div>

      <button
        type="button"
        onClick={() => setShowForm(false)}
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
          placeholder="Ej. Tirador redondo negro"
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
          placeholder="Ej. tirador-redondo-negro"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Código de producto
        </label>

        <input
          type="text"
          placeholder="Ej. FZ-TIR-002"
          value={productCode}
          onChange={(event) => setProductCode(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Categoría
        </label>

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
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
        <label className="mb-2 block text-sm font-medium">
          Precio
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Moneda
        </label>

        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="S/">S/ - Sol peruano</option>
          <option value="$">$ - Dólar estadounidense</option>
        </select>
      </div>
    </div>

<div className="mt-5">
  <label className="mb-2 block text-sm font-medium">
    Descripción
  </label>

  <textarea
    rows={4}
    placeholder="Describe las características del producto..."
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
  />
</div>

<div className="mt-5">
  <label className="mb-2 block text-sm font-medium">
    Imagen del producto
  </label>

<label
  htmlFor="product-image"
  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
>
  <span>🖼️</span>
  <span>Seleccionar imagen</span>
</label>

<input
  id="product-image"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(event) => {
    const file = event.target.files?.[0] ?? null;

    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }}
/>

  {imageFile && (
    <p className="mt-2 text-sm text-muted-foreground">
      Imagen seleccionada: {imageFile.name}
    </p>
  )}

  {imagePreview && (
  <div className="mt-4">
    <p className="mb-2 text-sm font-medium">
      Vista previa
    </p>

    <img
      src={imagePreview}
      alt="Vista previa del producto"
      className="h-40 w-40 rounded-lg border object-cover"
    />
  </div>
)}
</div>

<div className="mt-6 grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Orden de visualización
        </label>

        <input
          type="number"
          min="0"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-8 pt-8">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
          />
          Disponible
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Producto destacado
        </label>
      </div>
    </div>

<div className="mt-6 flex justify-end">
<button
  type="button"
  onClick={handleSaveProduct}
  disabled={saving}
  className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving
    ? "Guardando..."
    : editingProduct
      ? "Guardar cambios"
      : "Guardar producto"}
</button>
</div>
  </div>
)}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="grid grid-cols-[70px_1fr_160px_120px_120px_130px] gap-4 border-b bg-muted/40 px-6 py-4 text-sm font-semibold">
              <span>Orden</span>
              <span>Producto</span>
              <span>Categoría</span>
              <span>Precio</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[70px_1fr_160px_120px_120px_130px] items-center gap-4 border-b px-6 py-5 last:border-b-0"
              >
                <span className="text-sm text-muted-foreground">
                  {product.display_order}
                </span>

                <div>
                  <p className="font-semibold text-foreground">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Código: {product.product_code ?? "Sin código"}
                  </p>
                </div>

                <span className="text-sm text-muted-foreground">
                  {product.category?.name ?? "Sin categoría"}
                </span>

                <span className="text-sm font-medium">
                  {product.currency} {product.price.toFixed(2)}
                </span>

                <div>
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      product.available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.available ? "Disponible" : "No disponible"}
                  </span>

                  {product.featured && (
                    <span className="mt-2 block text-xs font-medium text-primary">
                      ★ Destacado
                    </span>
                  )}
                </div>

<div className="flex flex-col gap-2">
  <button
    type="button"
    onClick={() => handleEditProduct(product)}
    className="text-left text-sm font-medium text-primary hover:underline"
  >
    Editar
  </button>

  <button
    type="button"
    onClick={() => handleDeleteProduct(product)}
    className="text-left text-sm font-medium text-destructive hover:underline"
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