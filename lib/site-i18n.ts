/* ───────────────────────────────────────────────────────────
   Loader centralizzato dei dati del SITO (prodotti, esperti,
   metriche, colonne del footer, step del quiz) secondo LOCALE
   (i18n/config.ts). Per lanciare in un'altra lingua: crea
   messages/{locale}/site.json e aggiungi il case qui sotto.
   ─────────────────────────────────────────────────────────── */

import { LOCALE } from "@/i18n/config";
import itSite from "@/messages/it/site.json";

export type Product = {
  name: string;
  subtitle: string;
  price: string;
  priceSuffix?: string;
  tag: string;
  img: string;
  features: string[];
  featured?: boolean;
  comingSoon?: boolean;
};

export type Expert = { name: string; role: string; spec: string; img: string };
export type Metric = { value: number; prefix?: string; suffix?: string; label: string };
export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type QuizStep = { key: string; q: string; sub?: string; opts: string[] };

export type SiteData = {
  lossStat: number;
  products: Product[];
  adsProducts: Product[];
  experts: Expert[];
  metrics: Metric[];
  footerColumns: FooterColumn[];
  quizSteps: QuizStep[];
};

const SITE_BY_LOCALE: Record<string, SiteData> = {
  it: itSite as SiteData,
};

export const siteData: SiteData = SITE_BY_LOCALE[LOCALE];
