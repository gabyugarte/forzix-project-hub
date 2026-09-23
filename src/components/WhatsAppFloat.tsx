import { getWhatsappNumber, whatsappLink, generalMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

/** Botón flotante de WhatsApp, visible en toda la web. */
export function WhatsAppFloat() {
async function handleClick() {
const whatsappNumber = await getWhatsappNumber();
const url = whatsappLink(whatsappNumber, generalMessages.contacto);


window.open(url, "_blank", "noopener,noreferrer");


}

return ( <button
   type="button"
   onClick={handleClick}
   aria-label="Escribir por WhatsApp a FORZIX"
   className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink-foreground shadow-card-hover transition-transform duration-200 hover:scale-105 focus-visible:scale-105 sm:bottom-6 sm:right-6"
 > <WhatsAppIcon className="h-7 w-7" /> </button>
);
}
