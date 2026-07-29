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
  };
  comune: {
    introBySize: Record<string, string>;
    legalNote: string[];
    howItWorks: string[];
    sections: Record<string, string>;
    faqs: Record<string, string>;
  };
  internalLinks: {
    nationalHubs: string[];
    pillars: Record<string, { label: string; href: string }[]>;
    labels: Record<string, string>;
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
};

const TEMPLATES_BY_LOCALE: Record<string, BlogTemplatesData> = {
  it: itTemplates as BlogTemplatesData,
};

const ARTICLES_BY_LOCALE: Record<string, ArticleDraft[]> = {
  it: itArticles as ArticleDraft[],
};

export const blogDrugsData: BlogDrugsData = DRUGS_BY_LOCALE[LOCALE];
export const blogTemplates: BlogTemplatesData = TEMPLATES_BY_LOCALE[LOCALE];
export const blogArticles: ArticleDraft[] = ARTICLES_BY_LOCALE[LOCALE];
