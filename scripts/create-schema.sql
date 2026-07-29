-- =============================================================================
-- DoctorLife — Script de creación completa del schema en Neon
-- Generado: 2026-06-29
-- Uso: psql $DATABASE_URL -f scripts/create-schema.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SCHEMAS
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS neon_auth;

-- -----------------------------------------------------------------------------
-- SCHEMA: public — Auth (Better Auth)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public."user" (
  id                TEXT PRIMARY KEY,
  name              TEXT,
  email             TEXT NOT NULL UNIQUE,
  "emailVerified"   BOOLEAN NOT NULL DEFAULT FALSE,
  image             TEXT,
  role              TEXT NOT NULL DEFAULT 'patient',
  "createdAt"       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.account (
  id                        TEXT PRIMARY KEY,
  "accountId"               TEXT NOT NULL,
  "providerId"              TEXT NOT NULL,
  "userId"                  TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "accessToken"             TEXT,
  "refreshToken"            TEXT,
  "idToken"                 TEXT,
  "accessTokenExpiresAt"    TIMESTAMP WITHOUT TIME ZONE,
  "refreshTokenExpiresAt"   TIMESTAMP WITHOUT TIME ZONE,
  scope                     TEXT,
  password                  TEXT,
  "createdAt"               TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"               TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.session (
  id          TEXT PRIMARY KEY,
  token       TEXT NOT NULL UNIQUE,
  "userId"    TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "expiresAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.verification (
  id           TEXT PRIMARY KEY,
  identifier   TEXT NOT NULL,
  value        TEXT NOT NULL,
  "expiresAt"  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  "createdAt"  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- SCHEMA: public — App Tables
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id                  SERIAL PRIMARY KEY,
  "userId"            TEXT NOT NULL UNIQUE REFERENCES public."user"(id) ON DELETE CASCADE,
  "fullName"          TEXT,
  specialty           TEXT,
  bio                 TEXT,
  "licenseNumber"     TEXT,
  timezone            TEXT,
  "slotMinutes"       INTEGER NOT NULL DEFAULT 30,
  "maxPatients"       INTEGER NOT NULL DEFAULT 50,
  "acceptingPatients" BOOLEAN NOT NULL DEFAULT TRUE,
  "stripeAccountId"   TEXT,
  "stripeOnboarded"   BOOLEAN NOT NULL DEFAULT FALSE,
  "chargesEnabled"    BOOLEAN NOT NULL DEFAULT FALSE,
  "payoutsEnabled"    BOOLEAN NOT NULL DEFAULT FALSE,
  "isDevOnly"         BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id            SERIAL PRIMARY KEY,
  "userId"      TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "dayOfWeek"   INTEGER NOT NULL CHECK ("dayOfWeek" BETWEEN 0 AND 6),
  "startMinute" INTEGER NOT NULL,
  "endMinute"   INTEGER NOT NULL,
  "createdAt"   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.availability_exceptions (
  id          SERIAL PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id                  SERIAL PRIMARY KEY,
  name                TEXT,
  email               TEXT,
  age                 INTEGER,
  sex                 TEXT,
  weight_kg           INTEGER,
  height_cm           INTEGER,
  bmi                 NUMERIC(5,2),
  goal                TEXT,
  timeline            TEXT,
  plan                TEXT,
  source              TEXT,
  eligibility         TEXT,
  eligibility_reason  TEXT,
  glp1_experience     TEXT,
  contraindications   TEXT,
  comorbidities       TEXT,
  pregnancy           TEXT,
  format_preference   TEXT,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    SERIAL PRIMARY KEY,
  "patientId"           TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorId"            TEXT REFERENCES public."user"(id) ON DELETE SET NULL,
  plan                  TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'active',
  "stripeCustomerId"    TEXT,
  "stripeSubscriptionId" TEXT,
  "priceCents"          INTEGER NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'eur',
  "cancelAtPeriodEnd"   BOOLEAN NOT NULL DEFAULT FALSE,
  "currentPeriodEnd"    TIMESTAMP WITH TIME ZONE,
  "followupDueAt"       TIMESTAMP WITH TIME ZONE,
  "createdAt"           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id                      SERIAL PRIMARY KEY,
  "patientId"             TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorId"              TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "leadId"                INTEGER REFERENCES public.leads(id) ON DELETE SET NULL,
  "startsAt"              TIMESTAMP WITH TIME ZONE NOT NULL,
  "endsAt"                TIMESTAMP WITH TIME ZONE NOT NULL,
  status                  TEXT NOT NULL DEFAULT 'pending',
  "meetingUrl"            TEXT,
  "googleEventId"         TEXT,
  "stripePaymentIntentId" TEXT,
  "stripeSessionId"       TEXT,
  "stripeTransferId"      TEXT,
  "amountCents"           INTEGER NOT NULL DEFAULT 0,
  "applicationFeeCents"   INTEGER NOT NULL DEFAULT 0,
  currency                TEXT NOT NULL DEFAULT 'eur',
  "cancelledBy"           TEXT,
  "rescheduledToId"       INTEGER REFERENCES public.appointments(id) ON DELETE SET NULL,
  "createdAt"             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id                      SERIAL PRIMARY KEY,
  "patientId"             TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorId"              TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorStatus"          TEXT NOT NULL DEFAULT 'active',
  "lastMessageAt"         TIMESTAMP WITH TIME ZONE,
  "lastPatientNotifiedAt" TIMESTAMP WITH TIME ZONE,
  "lastDoctorNotifiedAt"  TIMESTAMP WITH TIME ZONE,
  "createdAt"             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id               SERIAL PRIMARY KEY,
  "conversationId" INTEGER NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  "senderId"       TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  body             TEXT NOT NULL,
  "readAt"         TIMESTAMP WITH TIME ZONE,
  "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id          SERIAL PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  href        TEXT,
  "readAt"    TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
  id              SERIAL PRIMARY KEY,
  "patientId"     TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorId"      TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "appointmentId" INTEGER REFERENCES public.appointments(id) ON DELETE SET NULL,
  medication      TEXT NOT NULL,
  dosage          TEXT,
  instructions    TEXT,
  "blobPathname"  TEXT,
  "issuedAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.progress_entries (
  id           SERIAL PRIMARY KEY,
  "patientId"  TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  weight_kg    NUMERIC(5,2),
  waist_cm     NUMERIC(5,2),
  dose         TEXT,
  side_effects TEXT,
  note         TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_notes (
  id          SERIAL PRIMARY KEY,
  "doctorId"  TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "patientId" TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  visibility  TEXT NOT NULL DEFAULT 'private',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.commissions (
  id                 SERIAL PRIMARY KEY,
  "doctorId"         TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "patientId"        TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "subscriptionId"   INTEGER REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  kind               TEXT NOT NULL,
  "amountCents"      INTEGER NOT NULL DEFAULT 0,
  currency           TEXT NOT NULL DEFAULT 'eur',
  "stripeInvoiceId"  TEXT,
  "createdAt"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id            SERIAL PRIMARY KEY,
  "patientId"   TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  "doctorId"    TEXT REFERENCES public."user"(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  message       TEXT,
  file_name     TEXT,
  file_type     TEXT,
  blob_pathname TEXT,
  review_note   TEXT,
  submitted_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- SCHEMA: neon_auth — Neon Auth managed tables
-- (Neon Auth crea estas tablas automáticamente al activar la integración.
--  Se incluyen aquí solo como referencia. NO ejecutar si Neon Auth ya está activo.)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS neon_auth."user" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  email           TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  image           TEXT,
  role            TEXT NOT NULL DEFAULT 'patient',
  banned          BOOLEAN,
  "banReason"     TEXT,
  "banExpires"    TIMESTAMP WITH TIME ZONE,
  "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.account (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountId"               TEXT NOT NULL,
  "providerId"              TEXT NOT NULL,
  "userId"                  UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  "accessToken"             TEXT,
  "refreshToken"            TEXT,
  "idToken"                 TEXT,
  "accessTokenExpiresAt"    TIMESTAMP WITH TIME ZONE,
  "refreshTokenExpiresAt"   TIMESTAMP WITH TIME ZONE,
  scope                     TEXT,
  password                  TEXT,
  "createdAt"               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.session (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token                 TEXT NOT NULL UNIQUE,
  "userId"              UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  "ipAddress"           TEXT,
  "userAgent"           TEXT,
  "activeOrganizationId" TEXT,
  "impersonatedBy"      TEXT,
  "expiresAt"           TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt"           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.verification (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier   TEXT NOT NULL,
  value        TEXT NOT NULL,
  "expiresAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.jwks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "publicKey"  TEXT NOT NULL,
  "privateKey" TEXT NOT NULL,
  "expiresAt"  TIMESTAMP WITH TIME ZONE,
  "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.organization (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  logo        TEXT,
  metadata    TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.member (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"         UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  "organizationId" UUID NOT NULL REFERENCES neon_auth.organization(id) ON DELETE CASCADE,
  role             TEXT NOT NULL DEFAULT 'member',
  "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.invitation (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL,
  role             TEXT NOT NULL DEFAULT 'member',
  status           TEXT NOT NULL DEFAULT 'pending',
  "organizationId" UUID NOT NULL REFERENCES neon_auth.organization(id) ON DELETE CASCADE,
  "inviterId"      UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  "expiresAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neon_auth.project_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id         TEXT,
  name                TEXT,
  allow_localhost      BOOLEAN NOT NULL DEFAULT FALSE,
  email_and_password  JSONB,
  social_providers    JSONB,
  email_provider      JSONB,
  webhook_config      JSONB,
  trusted_origins     JSONB,
  plugin_configs      JSONB,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES — para mejorar performance en queries frecuentes
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON public.appointments("patientId");
CREATE INDEX IF NOT EXISTS idx_appointments_doctor    ON public.appointments("doctorId");
CREATE INDEX IF NOT EXISTS idx_appointments_starts    ON public.appointments("startsAt");
CREATE INDEX IF NOT EXISTS idx_subscriptions_patient  ON public.subscriptions("patientId");
CREATE INDEX IF NOT EXISTS idx_subscriptions_doctor   ON public.subscriptions("doctorId");
CREATE INDEX IF NOT EXISTS idx_messages_conversation  ON public.messages("conversationId");
CREATE INDEX IF NOT EXISTS idx_messages_created       ON public.messages("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user     ON public.notifications("userId");
CREATE INDEX IF NOT EXISTS idx_progress_patient       ON public.progress_entries("patientId");
CREATE INDEX IF NOT EXISTS idx_conversations_patient  ON public.conversations("patientId");
CREATE INDEX IF NOT EXISTS idx_conversations_doctor   ON public.conversations("doctorId");
CREATE INDEX IF NOT EXISTS idx_doctor_avail_user      ON public.doctor_availability("userId");
CREATE INDEX IF NOT EXISTS idx_commissions_doctor     ON public.commissions("doctorId");
CREATE INDEX IF NOT EXISTS idx_leads_email            ON public.leads(email);

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================
