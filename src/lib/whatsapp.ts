import { business } from "@/config/business";
import type { Product } from "@/data/products";

/** Genera un enlace de WhatsApp con un mensaje ya preparado. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Mensaje personalizado para un producto del catálogo. */
export function productMessage(product: Pick<Product, "name" | "productCode">): string {
  const code = product.productCode ? ` (código ${product.productCode})` : "";
  return `Hola, estoy interesado en el producto ${product.name}${code} que vi en la web de FORZIX. ¿Podrían brindarme información sobre precio y disponibilidad?`;
}

export function productWhatsappLink(product: Pick<Product, "name" | "productCode">): string {
  return whatsappLink(productMessage(product));
}

export const generalMessages = {
  contacto:
    "Hola, escribo desde la web de FORZIX. Me gustaría recibir información sobre sus herrajes y accesorios.",
  cotizacion:
    "Hola, escribo desde la web de FORZIX. Me gustaría solicitar una cotización de herrajes y accesorios.",
  disponibilidad:
    "Hola, escribo desde la web de FORZIX. Quisiera consultar la disponibilidad de algunos productos.",
  distribucion:
    "Hola, escribo desde la web de FORZIX. Quisiera consultar sobre la distribución de productos a mi zona.",
};
