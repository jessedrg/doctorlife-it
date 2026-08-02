/* ───────────────────────────────────────────────────────────
   Loader centralizzato dei CONTENUTI del blog (farmaci + template
   testuali) in base alla lingua configurata in i18n/config.ts.

   Per lanciare il progetto in un'altra lingua:
   1) Cambia LOCALE in i18n/config.ts
   2) Crea messages/{locale}/blog-drugs.json e blog-templates.json
   3) Aggiungi il case qui sotto — nessun altro file da toccare.
   ─────────────────────────────────────────────────────────── */

import { LOCALE } from "@/i18n/config";

import itDrugs from "@/messages/it/blog-drugs.json";
import itTemplates from "@/messages/it/blog-templates.json";
import itArticles from "@/messages/it/blog-articles.json";

import deDrugs from "@/messages/de/blog-drugs.json";
import frDrugs from "@/messages/fr/blog-drugs.json";
import ptDrugs from "@/messages/pt/blog-drugs.json";
import nlDrugs from "@/messages/nl/blog-drugs.json";
import plDrugs from "@/messages/pl/blog-drugs.json";

export type DrugRaw = {
  key: string;
  name: string;
  inn: string;
  category: string;
  kind: "weight" | "diabetes";
  frequency: string;
  cover: string;
  rows: string[][];
  priceLow: string;
  priceHigh: string;
  pillarBuy: string;
  pillarPrice: string;
  compare: string;
};

export type ResearchDrugRaw = {
  key: string;
  name: string;
  Name: string;
  maker: string;
  klass: string;
  route: string;
  altKey: string;
  resultsP: string;
};

export type BlogDrugsData = {
  drugs: DrugRaw[];
  priceDrugKeys: string[];
  research: ResearchDrugRaw[];
};

export type BlogTemplatesData = {
  priceNote: string;
  serviceCta: string;
  illegalNote: string;
  weightIntros: string[][];
  diabIntros: string[][];
  steps: string[][];
  mechWeight: string[];
  mechDiab: string[];
  sideIntro: string[];
  sideList: string[];
  sideOutro: string[];
  contraP: string[];
  contraList: string[];
  storageList: string[];
  resultsWeight: string[];
  localBuy: string[];
  compareP: string[];
  benefitWeightTitles: string[];
  benefitWeightP: string[];
  benefitDiabTitles: string[];
  benefitDiabP: string[];
  drugCityIntro: string[];
  drugCityStock: string[];
  rxCityIntro: string[];
  rxCityRequirements: string[];
  rxCityValidity: string[];
  grayDangers: string[];
  legalRedirect: string[];
  approvalExplain: string[];
  sections: Record<string, string>;
  faqTemplates: Record<string, string>;
  localContext: Record<string, string>;
  localFaqs: Record<string, string>;
  postMeta: {
    buyPost: {
      slug: string; title: string; h1: string; metaTitle: string;
      metaDescription: string; excerpt: string; coverAlt: string; keyword: string;
    };
    pricePost: {
      slug: string; title: string; h1: string; metaTitle: string;
      metaDescription: string; excerpt: string; coverAlt: string; keyword: string;
      category: string; priceIntro: string; priceDependsList: string[];
    };
    drugCityPost: {
      slug: string; title: string; h1: string; metaTitle: string;
      metaDescription: string; excerpt: string; coverAlt: string; keyword: string;
    };
    rxCityPost: {
      slug: string; title: string; h1: string; metaTitle: string;
      metaDescription: string; excerpt: string; coverAlt: string; keyword: string;
      rxH2: string; reqH2: string; stepsH2: string;
    };
    researchPost: {
      slug: string; title: string; h1: string; metaTitle: string;
      metaDescription: string; excerpt: string; coverAlt: string;
      category: string; keyword: string;
      whatIsH2: string; whatIsP1: string; whatIsP2: string;
      studiesH2: string; approvalH2: string; approvalP1: string; approvalQuote: string;
      altH2: string; altP1: string; altLinksTitle: string;
      altLinks: { label: string; href: string }[];
      faqs: { q: string; a: string }[];
    };
    buyLinks: {
      title: string; priceLabel: string; buyLabel: string;
      compareLabel: string; cityPriceLabel: string; cityPriceHref: string;
    };
    priceTable: {
      weightHead: string[]; saxendaHead: string[]; caption: string;
    };
    formatPop: { millions: string; thousands: string };
    fallbackHealth: { short: string; long: string };
  };
  region: {
    introP1: string[];
    introP2: string[];
    introP3: string[];
    priceP: string[];
    priceP2: string[];
    rxP1: string[];
    rxP2: string[];
    obesityIntro: string[];
    obesityP2: string[];
    sections: Record<string, string>;
    capitalLinksTitle: string;
    postTitle: string;
    postH1: string;
    postMetaTitle: string;
    postMetaDescription: string;
    postExcerpt: string;
    postCoverAlt: string;
    postSlug: string;
    category: string;
    keywordVerb: string;
    healthFallbackShort: string;
    healthFallbackLong: string;
    pricingCaption: string;
    pricingHead: string[];
    pricingRows: string[][];
    capitalLinks: { label: string; href: string }[];
    howToStartList: string[];
    faqs: { q: string; a: string }[];
  };
  comune: {
    introBySize: Record<string, string>;
    legalNote: string[];
    howItWorks: string[];
    sections: Record<string, string>;
    faqs: Record<string, string>;
    postMeta: {
      slugPrefix: string;
      title: string; h1: string; metaTitle: string; metaDescription: string;
      excerpt: string; category: string; keyword: string; coverAlt: string;
      pricingCaption: string; pricingHead: string[]; pricingRows: string[][];
      whyOnlineSmall: string; whyOnlineLarge: string; doctorsLine: string;
      rxLine: string; followUpLine: string; popSuffix: string;
    };
  };
  internalLinks: {
    nationalHubs: string[];
    pillars: Record<string, { label: string; href: string }[]>;
    labels: Record<string, string>;
  };
  seoMeta: {
    valueSuffix: string; rxTitleSuffix: string; comparisonTitleSuffix: string;
    checks: string[];
    comparisonLead: string; priceLead: string; rxLead: string;
    clinicLead: string; buyLead: string; defaultLead: string;
    whereConnector: string; comparisonMarker: string;
    priceKeywords: string[]; rxKeywords: string[]; clinicKeywords: string[]; buyKeywords: string[];
    comparisonCategory: string; cityMarker: string; countryName: string;
  };
};

export type ArticleDraft = {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  keyword: string;
  sections: import("./blog").Section[];
  faqs: import("./blog").Faq[];
};

const DRUGS_BY_LOCALE: Record<string, BlogDrugsData> = {
  it: itDrugs as BlogDrugsData,
  de: deDrugs as BlogDrugsData,
  fr: frDrugs as BlogDrugsData,
  pt: ptDrugs as BlogDrugsData,
  nl: nlDrugs as BlogDrugsData,
  pl: plDrugs as BlogDrugsData,
};

/* Solo "it" ha già blog-templates.json / blog-articles.json completi (contenuto
   editoriale enorme). Gli altri paesi sono scaffolding: finché non vengono
   tradotti, il cluster blog usa i template italiani come fallback per evitare
   che il build fallisca. Aggiungi messages/{locale}/blog-templates.json e
   blog-articles.json e registrali qui sotto per completare la localizzazione. */
const TEMPLATES_BY_LOCALE: Record<string, BlogTemplatesData> = {
  it: itTemplates as BlogTemplatesData,
};

const ARTICLES_BY_LOCALE: Record<string, ArticleDraft[]> = {
  it: itArticles as ArticleDraft[],
};

export const blogDrugsData: BlogDrugsData = DRUGS_BY_LOCALE[LOCALE] ?? (itDrugs as BlogDrugsData);
export const blogTemplates: BlogTemplatesData =
  TEMPLATES_BY_LOCALE[LOCALE] ?? (itTemplates as BlogTemplatesData);
export const blogArticles: ArticleDraft[] = ARTICLES_BY_LOCALE[LOCALE] ?? (itArticles as ArticleDraft[]);
