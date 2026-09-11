import { whatsappLink, generalMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

/** Botón flotante de WhatsApp, visible en toda la web. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(generalMessages.contacto)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp a FORZIX"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink-foreground shadow-card-hover transition-transform duration-200 hover:scale-105 focus-visible:scale-105 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
