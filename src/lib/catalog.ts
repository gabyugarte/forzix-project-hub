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
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  product_code: string | null;
  available: boolean;
  featured: boolean;
  display_order: number;
  category: CatalogCategory;
}

export async function getCategories(): Promise<CatalogCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error loading categories:", error);
    throw error;
  }

  return data ?? [];
}

export async function getProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("available", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
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
    throw error;
  }

  return data;
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
    throw error;
  }

  return data ?? [];
}