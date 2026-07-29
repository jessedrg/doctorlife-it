import { getRequestConfig } from "next-intl/server";
import { LOCALE } from "./config";

/* ───────────────────────────────────────────────────────────
   Fonde i JSON di UI centralizzati (messages/{locale}/*.json)
   in un unico oggetto di messaggi per next-intl. Ogni file
   diventa un namespace: t("ui.navbar.start"), t("products.products.subscription.name")…
   Per aggiungere una lingua: crea la stessa serie di file in
   messages/{nuovoLocale}/ — nessun altro codice da toccare.
   ─────────────────────────────────────────────────────────── */
const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  it: async () => ({
    ui: (await import("../messages/it/ui.json")).default,
    products: (await import("../messages/it/products.json")).default,
    quiz: (await import("../messages/it/quiz.json")).default,
    pages: (await import("../messages/it/pages.json")).default,
    seo: (await import("../messages/it/seo.json")).default,
    glp1Info: (await import("../messages/it/glp1-info.json")).default,
  }),
  de: async () => ({
    ui: (await import("../messages/de/ui.json")).default,
    products: (await import("../messages/de/products.json")).default,
    quiz: (await import("../messages/de/quiz.json")).default,
    pages: (await import("../messages/de/pages.json")).default,
    seo: (await import("../messages/de/seo.json")).default,
    glp1Info: (await import("../messages/de/glp1-info.json")).default,
  }),
  fr: async () => ({
    ui: (await import("../messages/fr/ui.json")).default,
    products: (await import("../messages/fr/products.json")).default,
    quiz: (await import("../messages/fr/quiz.json")).default,
    pages: (await import("../messages/fr/pages.json")).default,
    seo: (await import("../messages/fr/seo.json")).default,
    glp1Info: (await import("../messages/fr/glp1-info.json")).default,
  }),
  pt: async () => ({
    ui: (await import("../messages/pt/ui.json")).default,
    products: (await import("../messages/pt/products.json")).default,
    quiz: (await import("../messages/pt/quiz.json")).default,
    pages: (await import("../messages/pt/pages.json")).default,
    seo: (await import("../messages/pt/seo.json")).default,
    glp1Info: (await import("../messages/pt/glp1-info.json")).default,
  }),
  nl: async () => ({
    ui: (await import("../messages/nl/ui.json")).default,
    products: (await import("../messages/nl/products.json")).default,
    quiz: (await import("../messages/nl/quiz.json")).default,
    pages: (await import("../messages/nl/pages.json")).default,
    seo: (await import("../messages/nl/seo.json")).default,
    glp1Info: (await import("../messages/nl/glp1-info.json")).default,
  }),
  pl: async () => ({
    ui: (await import("../messages/pl/ui.json")).default,
    products: (await import("../messages/pl/products.json")).default,
    quiz: (await import("../messages/pl/quiz.json")).default,
    pages: (await import("../messages/pl/pages.json")).default,
    seo: (await import("../messages/pl/seo.json")).default,
    glp1Info: (await import("../messages/pl/glp1-info.json")).default,
  }),
};

export default getRequestConfig(async () => {
  return {
    locale: LOCALE,
    messages: await LOADERS[LOCALE](),
  };
});
