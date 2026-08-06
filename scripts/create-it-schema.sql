-- ------------------------------------------------------------------
-- Schema "it" — aísla las tablas de ESTE proyecto (doctorlife-it.com)
-- de los demás proyectos que comparten la misma base Neon.
--
-- Solo contiene las tablas de MÉDICOS y LEADS. El resto de tablas
-- (user/auth, citas, suscripciones, etc.) siguen en el schema public.
--
-- Empezamos en limpio: las tablas se crean vacías.
-- ------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS it;

-- ---------------------------------------------------------------
-- it.doctor_profiles — perfiles de los médicos registrados AQUÍ.
-- Al vivir en el schema "it", la disponibilidad de este dominio
-- solo mostrará estos médicos (los de otros proyectos viven en public).
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS it.doctor_profiles (
  "id"                     serial PRIMARY KEY,
  "userId"                 text NOT NULL UNIQUE,
  "fullName"               text NOT NULL,
  "specialty"              text,
  "licenseNumber"          text,
  "bio"                    text,
  "stripeAccountId"        text,
  "stripeOnboarded"        boolean NOT NULL DEFAULT false,
  "chargesEnabled"         boolean NOT NULL DEFAULT false,
  "payoutsEnabled"         boolean NOT NULL DEFAULT false,
  "acceptingPatients"      boolean NOT NULL DEFAULT true,
  "maxPatients"            integer,
  "slotMinutes"            integer NOT NULL DEFAULT 30,
  "timezone"               text NOT NULL DEFAULT 'Europe/Madrid',
  "isDevOnly"              boolean NOT NULL DEFAULT false,
  "clinicName"             text,
  "taxId"                  text,
  "billingEmail"           text,
  "billingPhone"           text,
  "addressLine"            text,
  "city"                   text,
  "province"               text,
  "postalCode"             text,
  "medicalDirectorName"    text,
  "medicalDirectorLicense" text,
  "healthRegistryNumber"   text,
  "dataProtectionContact"  text,
  "domain"                 text,
  "createdAt"              timestamp NOT NULL DEFAULT now(),
  "updatedAt"              timestamp NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- it.leads — leads capturados en ESTE dominio (doctorlife-it.com).
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS it.leads (
  "id"                  serial PRIMARY KEY,
  "name"                text,
  "email"               text NOT NULL,
  "phone"               text,
  "goal"                text,
  "glp1_experience"     text,
  "format_preference"   text,
  "timeline"            text,
  "plan"                text,
  "height_cm"           integer,
  "weight_kg"           integer,
  "age"                 integer,
  "bmi"                 numeric(4, 1),
  "sex"                 text,
  "pregnancy"           text,
  "comorbidities"       text,
  "contraindications"   text,
  "eligibility"         text,
  "eligibility_reason"  text,
  "appointment_at"      timestamptz,
  "source"              text DEFAULT 'quiz',
  "domain"              text,
  "created_at"          timestamptz NOT NULL DEFAULT now()
);
