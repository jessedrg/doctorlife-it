/**
 * ─────────────────────────────────────────────────────────────
 *  Configuración central de i18n.
 *  Cambia LOCALE aquí para cambiar el idioma de toda la web.
 *  Añade el JSON correspondiente en /messages/{LOCALE}.json
 * ─────────────────────────────────────────────────────────────
 */

export const LOCALE: LocaleCode = "it";

export type Locale = LocaleCode;

/**
 * Interruttore centrale per il modulo di lead (quiz/prenotazione).
 * Metti su `false` per bloccare/disabilitare tutti i pulsanti CTA
 * (QuizTrigger) in tutto il sito, senza toccare nessun componente.
 */
export const FORM_ENABLED = true;

/**
 * Paesi/lingue disponibili. "it" è quello attivo (vedi LOCALE sopra).
 * Gli altri sono pronti come SCAFFOLDING: hanno dati geografici e SEO
 * reali in messages/{locale}/geo-*.json e seo.json. Per lanciare in uno
 * di questi paesi: 1) cambia LOCALE qui sopra, 2) completa i contenuti
 * UI/blog mancanti in messages/{locale}/ seguendo lo stesso schema di "it".
 */
export const locales = ["it", "de", "fr", "pt", "nl", "pl"] as const;

export type LocaleCode = (typeof locales)[number];

/** HTML lang attribute */
export const HTML_LANG: Record<LocaleCode, string> = {
  it: "it",
  de: "de",
  fr: "fr",
  pt: "pt",
  nl: "nl",
  pl: "pl",
};

/** Open Graph locale */
export const OG_LOCALE: Record<LocaleCode, string> = {
  it: "it_IT",
  de: "de_DE",
  fr: "fr_FR",
  pt: "pt_PT",
  nl: "nl_NL",
  pl: "pl_PL",
};

/** Trustpilot data-locale */
export const TRUSTPILOT_LOCALE: Record<LocaleCode, string> = {
  it: "it-IT",
  de: "de-DE",
  fr: "fr-FR",
  pt: "pt-PT",
  nl: "nl-NL",
  pl: "pl-PL",
};

/** toLocaleDateString locale */
export const DATE_LOCALE: Record<LocaleCode, string> = {
  it: "it-IT",
  de: "de-DE",
  fr: "fr-FR",
  pt: "pt-PT",
  nl: "nl-NL",
  pl: "pl-PL",
};

/** Schema.org inLanguage */
export const SCHEMA_LANG: Record<LocaleCode, string> = {
  it: "it-IT",
  de: "de-DE",
  fr: "fr-FR",
  pt: "pt-PT",
  nl: "nl-NL",
  pl: "pl-PL",
};

/** Country code for SEO schemas */
export const COUNTRY_CODE: Record<LocaleCode, string> = {
  it: "IT",
  de: "DE",
  fr: "FR",
  pt: "PT",
  nl: "NL",
  pl: "PL",
};

/** Country name for SEO schemas */
export const COUNTRY_NAME: Record<LocaleCode, string> = {
  it: "Italia",
  de: "Germania",
  fr: "Francia",
  pt: "Portogallo",
  nl: "Paesi Bassi",
  pl: "Polonia",
};

/** Available languages for contactPoint schema */
export const AVAILABLE_LANGUAGES: Record<LocaleCode, string[]> = {
  it: ["Italian"],
  de: ["German"],
  fr: ["French"],
  pt: ["Portuguese"],
  nl: ["Dutch"],
  pl: ["Polish"],
};

/** Dominio pubblico per paese (usato per SITE_URL dinamico in ogni seo.json). */
export const DOMAIN: Record<LocaleCode, string> = {
  it: "doctorlife-it.com",
  de: "doctorlife.de",
  fr: "doctorlife.fr",
  pt: "doctorlife.pt",
  nl: "doctorlife.nl",
  pl: "doctorlife.pl",
};

/** Valuta usata nei prezzi (tutti EUR salvo la Polonia, che usa PLN). */
export const CURRENCY: Record<LocaleCode, string> = {
  it: "EUR",
  de: "EUR",
  fr: "EUR",
  pt: "EUR",
  nl: "EUR",
  pl: "PLN",
};
