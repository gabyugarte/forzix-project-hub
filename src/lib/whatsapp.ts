import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/products";

const fallbackWhatsappNumber = "51000000000";

/**
 * Obtiene el número de WhatsApp configurado desde Supabase.
 * Si no existe o hay un error, utiliza el número de respaldo.
 */
export async function getWhatsappNumber(): Promise<string> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("whatsapp_number")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo WhatsApp:", error);
    return fallbackWhatsappNumber;
  }

  const rawNumber = data?.whatsapp_number?.trim();

return rawNumber
  ? rawNumber.replace(/\D/g, "")
  : fallbackWhatsappNumber;
}

/** Genera un enlace de WhatsApp con un número determinado. */
export function whatsappLink(
  whatsappNumber: string,
  message: string,
): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Mensaje personalizado para un producto del catálogo. */
export function productMessage(
  product: Pick<Product, "name" | "productCode">,
): string {
  const code = product.productCode
    ? ` (código ${product.productCode})`
    : "";

  return `Hola, estoy interesado en el producto ${product.name}${code} que vi en la web de FORZIX. ¿Podrían brindarme información sobre precio y disponibilidad?`;
}

export function productWhatsappLink(
  whatsappNumber: string,
  product: Pick<Product, "name" | "productCode">,
): string {
  return whatsappLink(
    whatsappNumber,
    productMessage(product),
  );
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