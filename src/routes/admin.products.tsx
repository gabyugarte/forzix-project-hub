import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  subcategory_id: string | null;
  description: string | null;
  price: number | null;
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
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  display_order: number;
  attributes: Record<string, string> | null;
}

function getVariantPrice(
  variant: ProductVariant,
  product: Product
): number | null {
  return variant.price ?? product.price;
}

function getVariantCurrency(
  variant: ProductVariant,
  product: Product,
): string {
  return variant.price !== null
    ? variant.currency
    : product.currency;
}

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<
  { id: string; name: string; slug: string }[]
>([]);
const [subcategories, setSubcategories] = useState<
  {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    active: boolean;
  }[]
>([]);
const [subcategoryId, setSubcategoryId] = useState("");
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

const [variants, setVariants] = useState<ProductVariant[]>([]);
const [variantsLoading, setVariantsLoading] = useState(false);
const [variantSaving, setVariantSaving] = useState(false);
const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
const [variantError, setVariantError] = useState("");

const [variantSku, setVariantSku] = useState("");
const [variantName, setVariantName] = useState("");
const [variantPrice, setVariantPrice] = useState("");
const [variantMeasure, setVariantMeasure] = useState("");
const [variantFinish, setVariantFinish] = useState("");
const [variantColor, setVariantColor] = useState("");
const [variantAvailable, setVariantAvailable] = useState(true);
const [variantOrder, setVariantOrder] = useState("0");
const [variantImageFile, setVariantImageFile] = useState<File | null>(null);
const [variantImagePreview, setVariantImagePreview] = useState<string | null>(null);
const [variantImageUrl, setVariantImageUrl] = useState<string | null>(null);

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
  ),
  subcategory:subcategories(
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

  async function loadSubcategories() {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, name, slug, active")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error loading subcategories:", error);
    setError("No se pudieron cargar las subcategorías.");
    return;
  }

  setSubcategories(data ?? []);
}

  loadProducts();
  loadCategories();
  loadSubcategories();
}, []);

async function loadProductVariants(productId: string) {
  setVariantsLoading(true);
  setVariantError("");

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error cargando variantes:", error);
    setVariantError("No se pudieron cargar las variantes.");
    setVariantsLoading(false);
    return;
  }

  setVariants((data ?? []) as ProductVariant[]);
  setVariantsLoading(false);
}


function resetVariantForm() {
  setEditingVariantId(null);
  setVariantSku("");
  setVariantName("");
  setVariantPrice("");
  setVariantMeasure("");
  setVariantFinish("");
  setVariantColor("");
  setVariantAvailable(true);
  setVariantOrder("0");
  setVariantImageFile(null);
  setVariantImagePreview(null);
  setVariantImageUrl(null);
  setVariantError("");
}



async function handleEditVariant(variant: ProductVariant) {
  setEditingVariantId(variant.id);
  setVariantSku(variant.sku);
  setVariantName(variant.name ?? "");
  setVariantPrice(
    variant.price === null ? "" : String(variant.price),
  );
  setVariantMeasure(variant.attributes?.["medida"] ?? "");
  setVariantFinish(variant.attributes?.["acabado"] ?? "");
  setVariantColor(variant.attributes?.["color"] ?? "");
  setVariantAvailable(variant.available);
  setVariantOrder(String(variant.display_order));

  setVariantImageFile(null);
  setVariantImagePreview(null);
  setVariantImageUrl(null);
  setVariantError("");

  const { data, error } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("variant_id", variant.id)
    .eq("is_primary", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error cargando imagen de variante:", error);
    setVariantError("No se pudo cargar la imagen de la variante.");
    return;
  }

  if (data?.image_url) {
    setVariantImageUrl(data.image_url);
    setVariantImagePreview(data.image_url);
  }
}



async function handleSaveVariant() {
  if (!editingProduct) {
    setVariantError("Primero debes guardar el producto.");
    return;
  }

  if (!variantSku.trim()) {
    setVariantError("El SKU de la variante es obligatorio.");
    return;
  }

  const normalizedSku = variantSku.trim();

  const duplicateSku = variants.some(
    (variant) =>
      variant.sku.toLowerCase() === normalizedSku.toLowerCase() &&
      variant.id !== editingVariantId,
  );

  if (duplicateSku) {
    setVariantError(
      "Este SKU ya está registrado en este producto. Introduce una referencia diferente.",
    );
    return;
  }

  const numericVariantPrice = variantPrice.trim()
    ? Number(variantPrice)
    : null;

  if (
    numericVariantPrice !== null &&
    (!Number.isFinite(numericVariantPrice) || numericVariantPrice < 0)
  ) {
    setVariantError("Introduce un precio válido igual o mayor que 0.");
    return;
  }

  const numericVariantOrder = Number(variantOrder);

  if (
    !Number.isInteger(numericVariantOrder) ||
    numericVariantOrder < 0
  ) {
    setVariantError(
      "El orden debe ser un número entero igual o mayor que 0.",
    );
    return;
  }

  setVariantSaving(true);
  setVariantError("");

  const variantData = {
    product_id: editingProduct.id,
    sku: normalizedSku,
    name: variantName.trim() || null,
    price: numericVariantPrice,
    currency,
    available: variantAvailable,
    display_order: numericVariantOrder,
    attributes: {
      medida: variantMeasure.trim(),
      acabado: variantFinish.trim(),
      color: variantColor.trim(),
    },
  };

  // Guardar la variante y obtener su ID.
  const result = editingVariantId
    ? await supabase
        .from("product_variants")
        .update(variantData)
        .eq("id", editingVariantId)
        .select("*")
        .single()
    : await supabase
        .from("product_variants")
        .insert(variantData)
        .select("*")
        .single();

  if (result.error || !result.data) {
    console.error("Error guardando variante:", result.error);

    setVariantError(
      result.error?.code === "23505"
        ? "Ese SKU ya está registrado. Cada variante debe tener un SKU único."
        : "No se pudo guardar la variante. Comprueba los permisos y vuelve a intentarlo.",
    );

    setVariantSaving(false);
    return;
  }

  const savedVariant = result.data as ProductVariant;

  // Si se seleccionó una imagen, subirla al almacenamiento.
  if (variantImageFile) {
    const fileExtension =
      variantImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExtension}`;

    const filePath = `variants/${editingProduct.id}/${savedVariant.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, variantImageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo imagen de variante:", uploadError);

      await loadProductVariants(editingProduct.id);
      setEditingVariantId(savedVariant.id);
      setVariantError(
        "La variante se guardó, pero no se pudo subir la imagen. Comprueba los permisos de almacenamiento e inténtalo de nuevo.",
      );
      setVariantSaving(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const newImageUrl = publicUrlData.publicUrl;

    // Buscar la imagen principal anterior de esta variante.
    const { data: existingImage, error: imageQueryError } = await supabase
      .from("product_images")
      .select("id, image_url")
      .eq("variant_id", savedVariant.id)
      .eq("is_primary", true)
      .limit(1)
      .maybeSingle();

    if (imageQueryError) {
      console.error("Error consultando imagen anterior:", imageQueryError);

      setVariantError(
        "La imagen se subió, pero no se pudo consultar la imagen anterior. No vuelvas a subirla todavía; revisa la tabla product_images.",
      );
      setVariantSaving(false);
      return;
    }

    // Reemplazar la imagen principal o crear una nueva.
    const imageResult = existingImage
      ? await supabase
          .from("product_images")
          .update({ image_url: newImageUrl })
          .eq("id", existingImage.id)
      : await supabase.from("product_images").insert({
          product_id: editingProduct.id,
          variant_id: savedVariant.id,
          image_url: newImageUrl,
          alt_text: `${savedVariant.name ?? savedVariant.sku}`,
          is_primary: true,
          display_order: 0,
        });

    if (imageResult.error) {
      console.error("Error guardando relación de imagen:", imageResult.error);

      setVariantError(
        "La variante se guardó, pero no se pudo asociar la imagen. Revisa los permisos de product_images antes de volver a intentarlo.",
      );
      setVariantSaving(false);
      return;
    }

    // Eliminar el archivo anterior solo después de actualizar su registro.
    if (existingImage?.image_url) {
      const previousImagePath = getStoragePathFromPublicUrl(
        existingImage.image_url,
      );

      if (previousImagePath) {
        const { error: deleteImageError } = await supabase.storage
          .from("product-images")
          .remove([previousImagePath]);

        if (deleteImageError) {
          console.error(
            "No se pudo eliminar el archivo de imagen anterior:",
            deleteImageError,
          );
        }
      }
    }
  }

  await loadProductVariants(editingProduct.id);
  resetVariantForm();
  setVariantSaving(false);
}


async function handleDeleteVariant(variant: ProductVariant) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar la variante "${variant.sku}"?`,
  );

  if (!confirmed) return;

  setVariantError("");

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variant.id);

  if (error) {
    console.error("Error eliminando variante:", error);
    setVariantError("No se pudo eliminar la variante.");
    return;
  }

  setVariants((current) =>
    current.filter((item) => item.id !== variant.id),
  );

  if (editingVariantId === variant.id) {
    resetVariantForm();
  }
}

function handleEditProduct(product: Product) {
  setEditingProduct(product);
  setImageFile(null);
  setImagePreview(product.image_url);
  setName(product.name);
  setSlug(product.slug);
  setProductCode(product.product_code ?? "");
  setCategoryId(product.category_id);
  setSubcategoryId(product.subcategory_id ?? "");
  setDescription(product.description ?? "");
  setPrice(String(product.price));
  setCurrency(product.currency);
  setAvailable(product.available);
  setFeatured(product.featured);
  setDisplayOrder(String(product.display_order));

  setError("");
  setVariantError("");
  setVariants([]);
  setShowForm(true);
  void loadProductVariants(product.id);

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

const numericPrice = price.trim() === "" ? null : Number(price);

if (
  numericPrice !== null &&
  (!Number.isFinite(numericPrice) || numericPrice < 0)
) {
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
  subcategory_id: subcategoryId || null,
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
  ),
  subcategory:subcategories(
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
  ),
  subcategory:subcategories(
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
  setSubcategoryId("");
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
          onChange={(event) => {
  setCategoryId(event.target.value);
  setSubcategoryId("");
}}
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
    Subcategoría
  </label>

  <select
    value={subcategoryId}
    onChange={(event) => setSubcategoryId(event.target.value)}
    disabled={!categoryId}
    className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
  >
    <option value="">
      {categoryId
        ? "Sin subcategoría"
        : "Primero selecciona una categoría"}
    </option>

    {subcategories
      .filter(
        (subcategory) =>
          subcategory.category_id === categoryId &&
          (subcategory.active || subcategory.id === subcategoryId),
      )
      .map((subcategory) => (
        <option key={subcategory.id} value={subcategory.id}>
          {subcategory.name}
          {!subcategory.active ? " (inactiva)" : ""}
        </option>
      ))}
  </select>

  <p className="mt-1 text-xs text-muted-foreground">
    Opcional. Solo aparecen las subcategorías de la categoría seleccionada.
  </p>
</div>


      <div>
        <label className="mb-2 block text-sm font-medium">
          Precio
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Dejar vacío si está pendiente"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="mt-1 text-xs text-muted-foreground">
  Opcional. Puedes añadir el precio cuando esté confirmado.
</p>
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
{/* Variantes del producto */}
<div className="mt-8 border-t pt-6">
  <h3 className="text-lg font-semibold text-foreground">
    Variantes y referencias del catálogo
  </h3>

  <p className="mt-1 text-sm text-muted-foreground">
    Registra cada referencia real del fabricante con su SKU, medida,
    acabado y precio.
  </p>

  {!editingProduct ? (
    <p className="mt-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
      Guarda primero el producto. Después podrás editarlo y añadir sus
      variantes.
    </p>
  ) : (
    <>
      {variantsLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Cargando variantes...
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {variants.length === 0 ? (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
              Este producto todavía no tiene variantes.
            </p>
          ) : (
            variants.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    {variant.sku}
                    {variant.name ? ` — ${variant.name}` : ""}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {[
                    [
  variant.attributes?.["medida"],
  variant.attributes?.["acabado"],
  variant.attributes?.["color"],
]
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Sin atributos adicionales"}
                  </p>

               <p className="mt-1 text-sm">
  {getVariantCurrency(variant, editingProduct)}{" "}
  {getVariantPrice(variant, editingProduct) !== null
  ? getVariantPrice(variant, editingProduct)!.toFixed(2)
  : "Consultar precio"}
  {variant.price === null && (
    <span className="ml-1 text-xs text-muted-foreground">
      (precio general)
    </span>
  )}
  {" · "}
  {variant.available ? "Disponible" : "No disponible"}
</p>
                </div>

                <div className="flex shrink-0 gap-4">
                  <button
                    type="button"
                    onClick={() => handleEditVariant(variant)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteVariant(variant)}
                    className="text-sm font-medium text-destructive hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-5 rounded-xl border bg-background p-4">
        <h4 className="font-semibold">
          {editingVariantId ? "Editar variante" : "Añadir variante"}
        </h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              SKU / referencia real *
            </label>
            <input
              value={variantSku}
              onChange={(event) => setVariantSku(event.target.value)}
              placeholder="Ej. CT-013"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nombre o medida
            </label>
            <input
              value={variantName}
              onChange={(event) => setVariantName(event.target.value)}
              placeholder={'Ej. 14 pulgadas / 350 mm'}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Precio ({currency})
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={variantPrice}
              onChange={(event) => setVariantPrice(event.target.value)}
              placeholder="Opcional"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Medida
            </label>
            <input
              value={variantMeasure}
              onChange={(event) => setVariantMeasure(event.target.value)}
              placeholder="Ej. 350 mm"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Acabado
            </label>
            <input
              value={variantFinish}
              onChange={(event) => setVariantFinish(event.target.value)}
              placeholder="Ej. Galvanizado"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Color
            </label>
            <input
              value={variantColor}
              onChange={(event) => setVariantColor(event.target.value)}
              placeholder="Ej. Negro"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          
<div className="sm:col-span-2 lg:col-span-3">
  <label className="mb-2 block text-sm font-medium">
    Imagen de la variante
  </label>

  <label
    htmlFor="variant-image"
    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
  >
    <span>🖼️</span>
    <span>Seleccionar imagen</span>
  </label>

  <input
    id="variant-image"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(event) => {
      const file = event.target.files?.[0] ?? null;

      setVariantImageFile(file);

      if (file) {
        setVariantImagePreview(URL.createObjectURL(file));
      } else {
        setVariantImagePreview(variantImageUrl);
      }
    }}
  />

  {variantImageFile && (
    <p className="mt-2 text-sm text-muted-foreground">
      Imagen seleccionada: {variantImageFile.name}
    </p>
  )}

  {variantImagePreview ? (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium">
        Vista previa
      </p>

      <img
        src={variantImagePreview}
        alt={`Vista previa de la variante ${variantSku}`}
        className="h-40 w-40 rounded-lg border bg-white object-contain p-2"
      />
    </div>
  ) : (
    <p className="mt-2 text-sm text-muted-foreground">
      Todavía no hay una imagen propia para esta variante.
    </p>
  )}

  <p className="mt-2 text-xs text-muted-foreground">
    Si no seleccionas una imagen nueva, se conservará la imagen actual.
  </p>
</div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Orden de visualización
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={variantOrder}
              onChange={(event) => setVariantOrder(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input
              type="checkbox"
              checked={variantAvailable}
              onChange={(event) => setVariantAvailable(event.target.checked)}
            />
            Variante disponible
          </label>
        </div>

        {variantError && (
          <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {variantError}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {editingVariantId && (
            <button
              type="button"
              onClick={resetVariantForm}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium"
            >
              Cancelar edición
            </button>
          )}

          <button
            type="button"
            onClick={() => void handleSaveVariant()}
            disabled={variantSaving || variantsLoading}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {variantSaving
              ? "Guardando variante..."
              : editingVariantId
                ? "Guardar variante"
                : "Añadir variante"}
          </button>
        </div>
      </div>
    </>
  )}
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
  <>
    {/* Vista móvil */}
    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Orden {product.display_order}
              </p>

              <p className="mt-2 break-words text-base font-semibold text-foreground">
                {product.name}
              </p>

              <p className="mt-1 break-all text-xs text-muted-foreground">
                Código: {product.product_code ?? "Sin código"}
              </p>
            </div>
          </div>


<div className="mt-4 rounded-lg bg-muted/40 p-3">
  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
    Categoría
  </p>

  <p className="mt-1 break-words text-sm font-medium text-foreground">
    {product.category?.name ?? "Sin categoría"}
  </p>

  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
    Subcategoría
  </p>

  <p className="mt-1 break-words text-sm font-medium text-foreground">
    {product.subcategory?.name ?? "Sin subcategoría"}
  </p>
</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Precio
              </p>

              <p className="mt-1 text-sm font-medium">
                {product.price !== null
  ? `${product.currency} ${product.price.toFixed(2)}`
  : "Consultar precio"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Estado
              </p>

              <span
                className={`mt-1 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  product.available
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.available
                  ? "Disponible"
                  : "No disponible"}
              </span>
            </div>
          </div>

          {product.featured && (
            <p className="mt-3 text-xs font-medium text-primary">
              ★ Producto destacado
            </p>
          )}

          <div className="mt-4 flex items-center gap-5 border-t pt-4">
            <button
              type="button"
              onClick={() => handleEditProduct(product)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => handleDeleteProduct(product)}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>


{/* Tabla escritorio */}
<div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
  <div className="min-w-[1050px]">
    <div className="grid grid-cols-[60px_minmax(180px,1fr)_140px_150px_100px_100px_110px] gap-3 border-b bg-muted/40 px-5 py-4 text-sm font-semibold">
      <span>Orden</span>
      <span>Producto</span>
      <span>Categoría</span>
      <span>Subcategoría</span>
      <span>Precio</span>
      <span>Estado</span>
      <span>Acciones</span>
    </div>

    {products.map((product) => (
      <div
        key={product.id}
        className="grid grid-cols-[60px_minmax(180px,1fr)_140px_150px_100px_100px_110px] items-center gap-3 border-b px-5 py-5 last:border-b-0"
      >
        <span className="text-sm text-muted-foreground">
          {product.display_order}
        </span>

        <div className="min-w-0">
          <p className="break-words font-semibold text-foreground">
            {product.name}
          </p>

          <p className="mt-1 break-all text-xs text-muted-foreground">
            Código: {product.product_code ?? "Sin código"}
          </p>
        </div>

        <span className="break-words text-sm text-muted-foreground">
          {product.category?.name ?? "Sin categoría"}
        </span>

        <span className="break-words text-sm text-muted-foreground">
          {product.subcategory?.name ?? "Sin subcategoría"}
        </span>

        <span className="text-sm font-medium">
          {product.price !== null
            ? `${product.currency} ${product.price.toFixed(2)}`
            : "Consultar precio"}
        </span>

        <div>
          <span
            className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
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
</div>

  </>
)}
      </div>
    </main>
  );
}