/**
 * Catálogo de FORZIX.
 *
 * Fuente de datos única del catálogo. Edita este archivo para modificar
 * productos, precios o imágenes. En el futuro puede reemplazarse por una API o
 * Supabase manteniendo el mismo tipo `Product` sin cambiar los componentes.
 *
 * Los precios y códigos son valores de ejemplo, pensados para ser reemplazados
 * por la información real de la empresa.
 */

import bisagras from "@/assets/products/bisagras.jpg";
import correderas from "@/assets/products/correderas.jpg";
import pistones from "@/assets/products/pistones.jpg";
import pushOpen from "@/assets/products/push-open.jpg";
import tiradorBarra from "@/assets/products/tirador-barra.jpg";
import correderaCierreLento from "@/assets/products/corredera-cierre-lento.jpg";
import accesorios from "@/assets/products/accesorios.jpg";

export type CategorySlug =
  | "bisagras"
  | "correderas"
  | "pistones"
  | "push-open"
  | "tiradores"
  | "accesorios";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: CategorySlug;
  description: string;
  /** Precio de referencia. Reemplazar por el precio real. */
  price: number;
  currency: string;
  image: string;
  /** Código interno del producto. Reemplazar por el código real. */
  productCode?: string;
  available: boolean;
}

export const categories: Category[] = [
  {
    slug: "bisagras",
    name: "Bisagras",
    description: "Para el montaje de puertas de muebles y proyectos en melamina.",
    image: bisagras,
  },
  {
    slug: "correderas",
    name: "Correderas",
    description: "Sistemas de deslizamiento para cajones y módulos.",
    image: correderas,
  },
  {
    slug: "pistones",
    name: "Pistones",
    description: "Apoyo en la apertura y cierre de puertas y tapas.",
    image: pistones,
  },
  {
    slug: "push-open",
    name: "Sistemas Push Open",
    description: "Apertura por presión, sin tiradores a la vista.",
    image: pushOpen,
  },
  {
    slug: "tiradores",
    name: "Tiradores",
    description: "Terminaciones y agarraderas para puertas y cajones.",
    image: tiradorBarra,
  },
  {
    slug: "accesorios",
    name: "Accesorios para muebles",
    description: "Complementos para la fabricación y el montaje de mobiliario.",
    image: accesorios,
  },
];

export const categoryName = (slug: CategorySlug): string =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const products: Product[] = [
  {
    id: "bisagras",
    name: "Bisagras",
    category: "bisagras",
    description: "Bisagras para el montaje de puertas en muebles de melamina.",
    price: 3.5,
    currency: "S/",
    image: bisagras,
    productCode: "FZ-BIS-001",
    available: true,
  },
  {
    id: "correderas",
    name: "Correderas",
    category: "correderas",
    description: "Correderas para el deslizamiento de cajones en módulos de melamina.",
    price: 12,
    currency: "S/",
    image: correderas,
    productCode: "FZ-COR-001",
    available: true,
  },
  {
    id: "pistones",
    name: "Pistones",
    category: "pistones",
    description: "Pistones para acompañar la apertura y el cierre de puertas y tapas.",
    price: 9.5,
    currency: "S/",
    image: pistones,
    productCode: "FZ-PIS-001",
    available: true,
  },
  {
    id: "push-open",
    name: "Push Open",
    category: "push-open",
    description: "Sistema de apertura por presión para puertas sin tirador.",
    price: 6,
    currency: "S/",
    image: pushOpen,
    productCode: "FZ-PSH-001",
    available: true,
  },
  {
    id: "tirador-barra-acero-inoxidable",
    name: "Tirador barra de acero inoxidable",
    category: "tiradores",
    description: "Tirador tipo barra en acero inoxidable para puertas y cajones.",
    price: 14,
    currency: "S/",
    image: tiradorBarra,
    productCode: "FZ-TIR-001",
    available: true,
  },
  {
    id: "corredera-cierre-lento",
    name: "Corredera con cierre lento",
    category: "correderas",
    description: "Corredera con sistema de cierre lento para un deslizamiento suave.",
    price: 26,
    currency: "S/",
    image: correderaCierreLento,
    productCode: "FZ-COR-002",
    available: true,
  },
  {
    id: "corredera-push-open",
    name: "Corredera Push Open",
    category: "correderas",
    description: "Corredera con apertura por presión, para cajones sin tirador.",
    price: 29,
    currency: "S/",
    image: correderas,
    productCode: "FZ-COR-003",
    available: true,
  },
];

export const getProduct = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const formatPrice = (product: Pick<Product, "price" | "currency">): string =>
  `${product.currency} ${product.price.toFixed(2)}`;
