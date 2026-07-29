/* ───────────────────────────────────────────────────────────
   Contenuto centralizzato. Tutti i dati (testi / prezzi / persone)
   vivono in messages/{locale}/site.json, caricati da lib/site-i18n.ts
   secondo LOCALE (i18n/config.ts). Questo file è solo un layer di
   compatibilità tipato per i componenti esistenti.
   ─────────────────────────────────────────────────────────── */

import { siteData } from "./site-i18n";
import type { Product, Expert, Metric, FooterLink, FooterColumn, QuizStep } from "./site-i18n";

export type { Product, Expert, Metric, FooterLink, FooterColumn, QuizStep };

export const products: Product[] = siteData.products;
export const adsProducts: Product[] = siteData.adsProducts;
export const experts: Expert[] = siteData.experts;
export const metrics: Metric[] = siteData.metrics;
export const footerColumns: FooterColumn[] = siteData.footerColumns;
export const quizSteps: QuizStep[] = siteData.quizSteps;

/* Tutti i funnel (incluse le campagne) usano lo stesso questionario. */
export const adsQuizSteps: QuizStep[] = quizSteps;

/** Percentuale usata nei testi ("Perdi fino al {LOSS}%"). */
export const LOSS_STAT = siteData.lossStat;
