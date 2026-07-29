"use client";

import { usePathname } from "next/navigation";
import { WhatsAppBubble } from "./whatsapp-bubble";

const PRIVATE_PREFIXES = ["/clinica", "/admin", "/portal", "/sign-in", "/sign-up"];
// Funnels de Ads con su propia barra CTA fija: ocultamos la burbuja para no solapar.
const HIDDEN_PATHS = ["/consulta-medica-online", "/valoracion-medica", "/valoracion-medica-2"];

export function PublicWhatsAppBubble() {
  const pathname = usePathname() ?? "/";
  const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isHidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  // En los artículos del blog ya mostramos la barra sticky de WhatsApp,
  // así que ocultamos la burbuja flotante para no duplicar/solapar en móvil.
  const isBlogArticle = /^\/blog\/[^/]+/.test(pathname);
  if (isPrivate || isHidden || isBlogArticle) return null;
  return <WhatsAppBubble />;
}
