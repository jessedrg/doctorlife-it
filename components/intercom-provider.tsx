"use client";

import { useEffect } from "react";
import Intercom from "@intercom/messenger-js-sdk";

/**
 * Arranca el messenger de Intercom una sola vez en el cliente.
 * `vertical_padding` separa ligeramente la burbuja del borde inferior sin
 * subirla demasiado (la posición queda cerca de la estándar de Intercom).
 *
 * Cuando el quiz/formulario está abierto, el body recibe la clase
 * `quiz-open` (ver quiz-context) y globals.css oculta el launcher para que
 * no se superponga al formulario, sobre todo en móvil.
 */
export function IntercomProvider() {
  useEffect(() => {
    Intercom({
      app_id: "yy82pceq",
      vertical_padding: 24,
    });
  }, []);

  return null;
}
