"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void }
  }
}

type Props = {
  /** Alineación del contenido dentro del widget. */
  alignment?: "left" | "center" | "right"
  /** Tema del texto. En fondos oscuros usa "dark". */
  theme?: "light" | "dark"
  className?: string
}

/**
 * TrustBox "Micro Review Count" de Trustpilot.
 * El motor (bootstrap) se carga globalmente en app/layout.tsx.
 * Este componente solo pinta el contenedor y le pide a Trustpilot que lo renderice.
 */
export function TrustBox({ alignment = "center", theme = "light", className }: Props) {
  const t = useTranslations("ui.trustbox")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const load = () => window.Trustpilot?.loadFromElement(el, true)
    load()
    // Reintento por si el bootstrap aún no había cargado.
    const timer = setTimeout(load, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className ?? ""}`}
      data-locale="it-IT"
      data-template-id="5419b6a8b0d04a076446a9ad"
      data-businessunit-id="6a31f5806ee9de82cda0a274"
      data-style-height="24px"
      data-style-width="100%"
      data-token="aa9ab664-1b41-4f86-ab47-710663dcb76c"
      data-min-review-count="10"
      data-style-alignment={alignment}
      data-theme={theme}
    >
      <a href="https://it.trustpilot.com/review/doctorlife.io" target="_blank" rel="noopener noreferrer">
        {t("ariaLabel")}
      </a>
    </div>
  )
}
