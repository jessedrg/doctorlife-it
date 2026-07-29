/* ───────────────────────────────────────────────────────────
   Loader centralizzato dei dati GEOGRAFICI (regioni, provincie,
   città reali) in base alla lingua/paese configurato in
   i18n/config.ts. Nessun altro file importa direttamente i JSON:
   tutti passano da qui.

   Per lanciare il progetto in un altro paese/lingua:
   1) Cambia LOCALE in i18n/config.ts
   2) Crea messages/{locale}/geo-regions.json, geo-provinces.json,
      geo-cities.json con i dati reali del nuovo paese
   3) Aggiungi il case qui sotto — nessun'altra riga di codice da toccare.
   ─────────────────────────────────────────────────────────── */

import { LOCALE } from "@/i18n/config";

import itRegionsData from "@/messages/it/geo-regions.json";
import itProvincesData from "@/messages/it/geo-provinces.json";
import itCitiesData from "@/messages/it/geo-cities.json";

import deRegionsData from "@/messages/de/geo-regions.json";
import deProvincesData from "@/messages/de/geo-provinces.json";
import deCitiesData from "@/messages/de/geo-cities.json";

import frRegionsData from "@/messages/fr/geo-regions.json";
import frProvincesData from "@/messages/fr/geo-provinces.json";
import frCitiesData from "@/messages/fr/geo-cities.json";

import ptRegionsData from "@/messages/pt/geo-regions.json";
import ptProvincesData from "@/messages/pt/geo-provinces.json";
import ptCitiesData from "@/messages/pt/geo-cities.json";

import nlRegionsData from "@/messages/nl/geo-regions.json";
import nlProvincesData from "@/messages/nl/geo-provinces.json";
import nlCitiesData from "@/messages/nl/geo-cities.json";

import plRegionsData from "@/messages/pl/geo-regions.json";
import plProvincesData from "@/messages/pl/geo-provinces.json";
import plCitiesData from "@/messages/pl/geo-cities.json";

export type HealthService = { short: string; long: string };

export type Region = {
  name: string;
  slug: string;
  capital: string;
  capitalSlug?: string;
  pop: number;
  obesity: number;
  provinces: string[];
};

export type Province = {
  name: string;
  slug: string;
  capital: string;
  capitalSlug?: string;
  region: string;
  pop: number;
  cities: string[];
};

export type CityFacts = {
  region: string;
  province: string;
  pop: number;
  hospital: string;
  trait: string;
};

type RegionsData = { healthServices: Record<string, HealthService>; regions: Region[] };

const REGIONS_BY_LOCALE: Record<string, RegionsData> = {
  it: itRegionsData as RegionsData,
  de: deRegionsData as RegionsData,
  fr: frRegionsData as RegionsData,
  pt: ptRegionsData as RegionsData,
  nl: nlRegionsData as RegionsData,
  pl: plRegionsData as RegionsData,
};
const PROVINCES_BY_LOCALE: Record<string, Province[]> = {
  it: itProvincesData as Province[],
  de: deProvincesData as Province[],
  fr: frProvincesData as Province[],
  pt: ptProvincesData as Province[],
  nl: nlProvincesData as Province[],
  pl: plProvincesData as Province[],
};
const CITIES_BY_LOCALE: Record<string, Record<string, CityFacts>> = {
  it: itCitiesData as Record<string, CityFacts>,
  de: deCitiesData as Record<string, CityFacts>,
  fr: frCitiesData as Record<string, CityFacts>,
  pt: ptCitiesData as Record<string, CityFacts>,
  nl: nlCitiesData as Record<string, CityFacts>,
  pl: plCitiesData as Record<string, CityFacts>,
};

export const HEALTH_SERVICES: Record<string, HealthService> = REGIONS_BY_LOCALE[LOCALE].healthServices;
export const REGIONS: Region[] = REGIONS_BY_LOCALE[LOCALE].regions;
export const PROVINCES: Province[] = PROVINCES_BY_LOCALE[LOCALE];
export const CITY_FACTS: Record<string, CityFacts> = CITIES_BY_LOCALE[LOCALE];
