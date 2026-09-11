/**
 * Configuración central de FORZIX.
 * Reemplaza aquí los datos reales (WhatsApp, email, redes sociales).
 * Ningún componente debe contener estos datos directamente.
 */

export const business = {
  name: "FORZIX",
  tagline: "Herrajes y Accesorios",
  description:
    "Comercialización, importación y distribución de herrajes y accesorios para la fabricación y montaje de muebles.",
  country: "Perú",
  currency: "S/",

  /** PLACEHOLDER: reemplazar por el número real en formato internacional, sin + ni espacios. */
  whatsappNumber: "51000000000",

  /** PLACEHOLDER: reemplazar por el correo real. */
  email: "",

  /** PLACEHOLDER: reemplazar por las URLs reales de redes sociales. */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

export const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Distribución", to: "/distribucion" },
  { label: "Contacto", to: "/contacto" },
] as const;
