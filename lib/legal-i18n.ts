/* ───────────────────────────────────────────────────────────
   Loader centralizzato dei dati LEGALI (entità aziendale, privacy,
   termini, cookie) secondo LOCALE (i18n/config.ts). Per lanciare in
   un'altra lingua/paese: crea messages/{locale}/legal.json e
   aggiungi il case qui sotto — nessun altro file da toccare.
   ─────────────────────────────────────────────────────────── */

import { LOCALE } from "@/i18n/config";
import itLegal from "@/messages/it/legal.json";
import deLegal from "@/messages/de/legal.json";
import frLegal from "@/messages/fr/legal.json";
import ptLegal from "@/messages/pt/legal.json";
import nlLegal from "@/messages/nl/legal.json";
import plLegal from "@/messages/pl/legal.json";

export type LegalEntity = {
  companyName: string;
  vatNumber: string;
  healthProviderName: string;
  healthRegistryNumber: string;
  dpoEmail: string;
  supportEmail: string;
  jurisdictionCity: string;
  dataProtectionAuthority: string;
  emergencyNumber: string;
};

export type LegalSection = { title: string; body?: string; bullets?: string[] };

export type LegalData = typeof itLegal;

const LEGAL_BY_LOCALE: Record<string, LegalData> = {
  it: itLegal,
  de: deLegal,
  fr: frLegal,
  pt: ptLegal,
  nl: nlLegal,
  pl: plLegal,
};

export const legalData: LegalData = LEGAL_BY_LOCALE[LOCALE] ?? itLegal;
export const legalEntity: LegalEntity = legalData.entity;

/** Interpola {campo} en un texto usando los datos de la entidad legal. */
export function tplEntity(s: string): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (legalEntity as Record<string, string>)[k] ?? `{${k}}`);
}

/** Aplica tplEntity a título/cuerpo/bullets de una sección legal. */
export function resolveSection(s: LegalSection): LegalSection {
  return {
    title: tplEntity(s.title),
    body: s.body ? tplEntity(s.body) : undefined,
    bullets: s.bullets?.map(tplEntity),
  };
}
