/* ───────────────────────────────────────────────────────────
   Helper di dati strutturati (Schema.org / JSON-LD). Il CONTENUTO
   (nome brand, descrizioni, lingua) vive in
   messages/{locale}/seo.json, caricato secondo LOCALE
   (i18n/config.ts). Questo file contiene solo la logica.
   Usalo con <JsonLd data={...} /> in qualsiasi pagina.
   ─────────────────────────────────────────────────────────── */

import { LOCALE } from "@/i18n/config";
import itSeo from "@/messages/it/seo.json";
import itUi from "@/messages/it/ui.json";
import deSeo from "@/messages/de/seo.json";
import frSeo from "@/messages/fr/seo.json";
import ptSeo from "@/messages/pt/seo.json";
import nlSeo from "@/messages/nl/seo.json";
import plSeo from "@/messages/pl/seo.json";

type SeoData = typeof itSeo;
/* Solo "it" ha già ui.json completo; gli altri paesi sono scaffolding SEO
   (dominio, schema, dati struttura) pronti — completa ui.json quando lanci. */
const SEO_BY_LOCALE: Record<string, SeoData> = {
  it: itSeo,
  de: deSeo,
  fr: frSeo,
  pt: ptSeo,
  nl: nlSeo,
  pl: plSeo,
};
const S = SEO_BY_LOCALE[LOCALE].seo;
const SLOGAN = LOCALE === "it" ? itUi.metadata.slogan : S.brand;

export const SITE_URL = S.siteUrl;
export const BRAND = S.brand;
export const CONTACT_EMAIL = S.contactEmail;

/* Entità di marca: organizzazione medica. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
  image: `${SITE_URL}/icon.png`,
  slogan: SLOGAN,
  email: CONTACT_EMAIL,
  description: S.organizationDescription,
  medicalSpecialty: ["Endocrinology", "Bariatrics"],
  knowsAbout: S.knowsAbout,
  address: { "@type": "PostalAddress", addressCountry: S.countryCode },
  areaServed: { "@type": "Country", name: S.areaServed },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
    availableLanguage: S.availableLanguage,
    areaServed: S.countryCode,
  },
  sameAs: [S.sameAs],
  availableLanguage: LOCALE,
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: BRAND,
  url: SITE_URL,
  inLanguage: S.schemaLang,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
} as const;

export type Crumb = { name: string; url?: string };

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function toolSchema(opts: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: S.schemaLang,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function drugSchema(opts: {
  name: string;
  nonProprietaryName?: string;
  description?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: opts.name,
    ...(opts.nonProprietaryName ? { nonProprietaryName: opts.nonProprietaryName } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.url ? { url: opts.url } : {}),
    prescriptionStatus: "PrescriptionOnly",
    inLanguage: S.schemaLang,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}
