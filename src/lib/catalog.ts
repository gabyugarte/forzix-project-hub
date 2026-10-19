import { supabase } from "@/lib/supabase";

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
}


export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  subcategory_id: string | null;
  subcategory: {
  id: string;
  name: string;
  slug: string;
} | null;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  product_code: string | null;
  available: boolean;
  featured: boolean;
  display_order: number;
  category: CatalogCategory;
  variants?: CatalogProductVariant[];
}

export interface CatalogProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string | null;
  price: number | null;
  currency: string;
  available: boolean;
  display_order: number;
  attributes: {
    medida?: string;
    acabado?: string;
    color?: string;
    [key: string]: unknown;
  } | null;
  image_url?: string | null;
  variant_image_url?: string | null;
}


export async function getCategories(): Promise<CatalogCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

if (error) {
  console.error("Error loading categories:", error);
  return [];
}

return data ?? [];
}

export async function getSubcategories() {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, name, slug, category_id")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error loading subcategories:", error);
    return [];
  }

  return data ?? [];
}


export async function getProducts(): Promise<CatalogProduct[]> {

const { data, error } = await supabase
  .from("products")
  .select(`
    *,
    category:categories(*),
    subcategory:subcategories(
      id,
      name,
      slug
    )
  `)
  .eq("available", true)
  .order("display_order", { ascending: true });


if (error) {
  console.error("Error loading products:", error);
  return [];
}

return data ?? [];
}


export async function getProductBySlug(
  slug: string,
): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("slug", slug)
    .eq("available", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading product:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const { data: variantsData, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", data.id)
    .eq("available", true)
    .order("display_order", { ascending: true });

  if (variantsError) {
    console.error("Error loading product variants:", variantsError);
    return data as CatalogProduct;
  }

  const variants = variantsData ?? [];

  const variantsWithImages = await Promise.all(
    variants.map(async (variant) => {
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("variant_id", variant.id)
        .eq("is_primary", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (imageError) {
        console.error(
          `Error loading image for variant ${variant.sku}:`,
          imageError,
        );
      }

      return {
        ...variant,
        variant_image_url: imageData?.image_url ?? null,
      };
    }),
  );

  return {
    ...data,
    variants: variantsWithImages,
  } as CatalogProduct;
}


export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("available", true)
    .eq("featured", true)
    .order("display_order", { ascending: true });

if (error) {
  console.error("Error loading featured products:", error);
  return [];
}

return data ?? [];
}