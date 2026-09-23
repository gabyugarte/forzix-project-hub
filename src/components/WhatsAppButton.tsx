import type { ReactNode } from "react";
import { getWhatsappNumber, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
return ( <svg
   viewBox="0 0 24 24"
   aria-hidden="true"
   fill="currentColor"
   className={className}
 > <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.16 8.16 0 0 1-1.25-4.35c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.81 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.2-8.24 8.2Zm4.52-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.01 2.58.12.16 1.73 2.75 4.2 3.75.59.25 1.04.4 1.4.51.61.19 1.16.17 1.6.1.49-.07 1.5-.61 1.71-1.21.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.29Z" /> </svg>
);
}

type Variant = "primary" | "outline" | "whatsapp" | "light";

const variants: Record<Variant, string> = {
primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
outline: "border-2 border-primary text-primary bg-transparent hover:bg-accent",
whatsapp: "bg-whatsapp text-ink-foreground hover:brightness-95",
light: "bg-background text-foreground hover:bg-secondary",
};

interface Props {
message: string;
children?: ReactNode;
variant?: Variant;
size?: "sm" | "md" | "lg";
className?: string;
showIcon?: boolean;
}

/** Botón que abre WhatsApp con un mensaje ya preparado. */
export function WhatsAppButton({
message,
children = "Hablar por WhatsApp",
variant = "primary",
size = "md",
className,
showIcon = true,
}: Props) {
const sizes = {
sm: "h-10 px-4 text-sm",
md: "h-12 px-5 text-sm sm:text-base",
lg: "h-14 px-7 text-base",
};

async function handleClick() {
const whatsappNumber = await getWhatsappNumber();
const url = whatsappLink(whatsappNumber, message);


window.open(url, "_blank", "noopener,noreferrer");


}

return (
<button
type="button"
onClick={handleClick}
className={cn(
"inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
variants[variant],
sizes[size],
className,
)}
>
{showIcon && <WhatsAppIcon className="h-5 w-5 shrink-0" />} <span>{children}</span> </button>
);
}
