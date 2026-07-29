import { pgTable, serial, text, integer, numeric, timestamp, boolean, date } from "drizzle-orm/pg-core"

/* ------------------------------------------------------------------ */
/* Better Auth tables (do not rename columns — camelCase is required)  */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // 'patient' | 'doctor' | 'admin'
  role: text("role").notNull().default("patient"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type User = typeof user.$inferSelect

/* ------------------------------------------------------------------ */
/* App tables                                                          */
/* ------------------------------------------------------------------ */

/**
 * Perfil de cada médico + estado de su cuenta de Stripe Connect.
 * Se escala por `userId` en cada query (no hay RLS en Neon).
 */
export const doctorProfiles = pgTable("doctor_profiles", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  fullName: text("fullName").notNull(),
  specialty: text("specialty"),
  licenseNumber: text("licenseNumber"),
  bio: text("bio"),
  stripeAccountId: text("stripeAccountId"),
  stripeOnboarded: boolean("stripeOnboarded").notNull().default(false),
  chargesEnabled: boolean("chargesEnabled").notNull().default(false),
  payoutsEnabled: boolean("payoutsEnabled").notNull().default(false),
  acceptingPatients: boolean("acceptingPatients").notNull().default(true),
  /**
   * Máximo de pacientes activos (suscripciones active/trialing/past_due) que
   * el médico acepta simultáneamente. NULL = sin límite.
   */
  maxPatients: integer("maxPatients"),
  slotMinutes: integer("slotMinutes").notNull().default(30),
  timezone: text("timezone").notNull().default("Europe/Madrid"),
  /**
   * true  → médico de desarrollo (solo visible en dev.doctorlife.io y entornos no-prod).
   * false → médico de producción (visible en doctorlife.io y todos los entornos).
   * Se rellena automáticamente al crear el médico según el dominio de la petición.
   */
  isDevOnly: boolean("isDevOnly").notNull().default(false),
  /* --- Datos fiscales y sanitarios de la clínica (gestionados por la propia clínica) --- */
  /** Nombre comercial de la clínica (puede diferir del nombre del profesional). */
  clinicName: text("clinicName"),
  /** NIF / CIF fiscal. */
  taxId: text("taxId"),
  /** Email de facturación. */
  billingEmail: text("billingEmail"),
  /** Teléfono de facturación. */
  billingPhone: text("billingPhone"),
  /** Dirección fiscal. */
  addressLine: text("addressLine"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postalCode"),
  /** Director médico responsable. */
  medicalDirectorName: text("medicalDirectorName"),
  medicalDirectorLicense: text("medicalDirectorLicense"),
  /** Nº de registro sanitario del centro. */
  healthRegistryNumber: text("healthRegistryNumber"),
  /** Contacto de protección de datos (RGPD). */
  dataProtectionContact: text("dataProtectionContact"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type DoctorProfile = typeof doctorProfiles.$inferSelect
export type NewDoctorProfile = typeof doctorProfiles.$inferInsert

/**
 * Clínica (entidad sanitaria) que es el comerciante de liquidación de todo acto
 * médico en Stripe Connect. Modelo de una sola fila (fila única): la clínica
 * cobra al paciente vía `on_behalf_of` + `transfer_data.destination` y DoctorLife
 * retiene su comisión de servicio tecnológico (`application_fee`).
 */
export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  /** Razón social de la entidad sanitaria. */
  name: text("name").notNull().default("DoctorLife Clínica"),
  /** CIF/NIF de la entidad sanitaria (para facturación). */
  taxId: text("taxId"),
  // ── Domicilio fiscal ──
  addressLine: text("addressLine"),
  city: text("city"),
  postalCode: text("postalCode"),
  province: text("province"),
  // ── Datos de centro sanitario ──
  /** Nº de registro sanitario / autorización del centro (p. ej. NICA). */
  healthRegistryNumber: text("healthRegistryNumber"),
  /** Director médico responsable del centro. */
  medicalDirectorName: text("medicalDirectorName"),
  /** Nº de colegiado del director médico. */
  medicalDirectorLicense: text("medicalDirectorLicense"),
  // ── Contacto de facturación y RGPD ──
  billingEmail: text("billingEmail"),
  billingPhone: text("billingPhone"),
  /** Responsable de protección de datos (RGPD). */
  dataProtectionContact: text("dataProtectionContact"),
  // ── Stripe Connect ──
  stripeAccountId: text("stripeAccountId"),
  stripeOnboarded: boolean("stripeOnboarded").notNull().default(false),
  chargesEnabled: boolean("chargesEnabled").notNull().default(false),
  payoutsEnabled: boolean("payoutsEnabled").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type Clinic = typeof clinics.$inferSelect
export type NewClinic = typeof clinics.$inferInsert

/**
 * Disponibilidad semanal recurrente del médico.
 * dayOfWeek: 0 = domingo … 6 = sábado. Minutos desde medianoche (hora local del médico).
 */
export const doctorAvailability = pgTable("doctor_availability", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  dayOfWeek: integer("dayOfWeek").notNull(),
  startMinute: integer("startMinute").notNull(),
  endMinute: integer("endMinute").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type DoctorAvailability = typeof doctorAvailability.$inferSelect

/** Fechas puntuales bloqueadas (vacaciones, festivos…). */
export const availabilityExceptions = pgTable("availability_exceptions", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type AvailabilityException = typeof availabilityExceptions.$inferSelect

/**
 * Citas reservadas por pacientes.
 * status: 'pending_payment' | 'confirmed' | 'cancelled'
 * Se escala por patientId (paciente) o doctorId (médico) en cada query.
 */
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  startsAt: timestamp("startsAt", { withTimezone: true }).notNull(),
  endsAt: timestamp("endsAt", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("pending_payment"),
  leadId: integer("leadId"),
  amountCents: integer("amountCents").notNull().default(2500),
  currency: text("currency").notNull().default("eur"),
  stripeSessionId: text("stripeSessionId"),
  stripePaymentIntentId: text("stripePaymentIntentId"),
  // Id de la transferencia al médico (separate transfers). Se guarda para poder
  // revertirla y re-transferir si la cita se reasigna a otro médico.
  stripeTransferId: text("stripeTransferId"),
  applicationFeeCents: integer("applicationFeeCents").notNull().default(0),
  meetingUrl: text("meetingUrl"),
  googleEventId: text("googleEventId"),
  // Quién canceló la cita: 'doctor' | 'patient' | null. Si la canceló el médico,
  // el paciente verá la opción de reprogramar.
  cancelledBy: text("cancelledBy"),
  // Apunta a la nueva cita cuando esta se reprogramó (evita reprogramar dos veces).
  rescheduledToId: integer("rescheduledToId"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert

/** Hilo de conversación entre un paciente y un médico (uno por pareja). */
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  lastMessageAt: timestamp("lastMessageAt", { withTimezone: true }),
  // Estado fijado por el médico para organizar su bandeja: 'active' | 'pending' | 'archived'.
  doctorStatus: text("doctorStatus").notNull().default("active"),
  // Cooldown para el email de notificación de mensaje nuevo.
  // Guardamos cuándo se envió el último aviso a cada parte para no saturar el correo.
  lastPatientNotifiedAt: timestamp("lastPatientNotifiedAt", { withTimezone: true }),
  lastDoctorNotifiedAt: timestamp("lastDoctorNotifiedAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Conversation = typeof conversations.$inferSelect

/** Mensajes dentro de una conversación. */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  senderId: text("senderId").notNull(),
  body: text("body").notNull(),
  readAt: timestamp("readAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

/** Recetas emitidas por un médico. El PDF se guarda en un blob privado. */
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  appointmentId: integer("appointmentId"),
  medication: text("medication").notNull(),
  dosage: text("dosage").notNull(),
  instructions: text("instructions"),
  blobPathname: text("blobPathname").notNull(),
  issuedAt: timestamp("issuedAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Prescription = typeof prescriptions.$inferSelect
export type NewPrescription = typeof prescriptions.$inferInsert

/**
 * Suscripción mensual de tratamiento del paciente con su médico.
 * status refleja el estado de Stripe: incomplete | active | trialing | past_due | canceled.
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  plan: text("plan").notNull(),
  priceCents: integer("priceCents").notNull(),
  currency: text("currency").notNull().default("eur"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  status: text("status").notNull().default("incomplete"),
  currentPeriodEnd: timestamp("currentPeriodEnd", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
  // Se rellena al renovarse la suscripción (subscription_cycle): indica que el
  // paciente tiene una videollamada de seguimiento pendiente de agendar. Se
  // limpia al reservar la cita incluida (createIncludedBooking).
  followupDueAt: timestamp("followupDueAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

/**
 * Oferta de plan que la clínica (médico) envía a un paciente por correo tras la
 * primera consulta. El paciente la paga desde su portal y, al confirmarse el
 * pago, se activa su suscripción. `productId` referencia el catálogo
 * (`lib/catalog.ts`).
 * status: 'sent' | 'paid' | 'cancelled'
 */
export const planOffers = pgTable("plan_offers", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  productId: text("productId").notNull(),
  /** Nota opcional del médico que se incluye en el correo al paciente. */
  note: text("note"),
  status: text("status").notNull().default("sent"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paidAt", { withTimezone: true }),
})

export type PlanOffer = typeof planOffers.$inferSelect
export type NewPlanOffer = typeof planOffers.$inferInsert

/**
 * Comisiones que la plataforma abona al médico por los pagos de suscripción.
 * - kind "activation": primer pago, va ÍNTEGRO al médico.
 * - kind "renewal": renovación mensual, 25 € fijos al médico.
 * Una fila por factura de Stripe (invoiceId único) para evitar duplicados.
 */
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  doctorId: text("doctorId").notNull(),
  patientId: text("patientId").notNull(),
  subscriptionId: integer("subscriptionId"),
  kind: text("kind").notNull(), // 'activation' | 'renewal'
  amountCents: integer("amountCents").notNull(),
  currency: text("currency").notNull().default("eur"),
  stripeInvoiceId: text("stripeInvoiceId").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Commission = typeof commissions.$inferSelect
export type NewCommission = typeof commissions.$inferInsert

/**
 * Notificaciones para el panel del médico (campana).
 * type: 'subscription_activated' | 'subscription_renewed' | 'verification_submitted' | etc.
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  href: text("href"),
  readAt: timestamp("readAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert

/**
 * Leads capturados desde el quiz "Comenzar".
 * Son envíos públicos (sin cuenta de usuario), por eso no hay userId.
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  goal: text("goal"),
  glp1Experience: text("glp1_experience"),
  formatPreference: text("format_preference"),
  timeline: text("timeline"),
  plan: text("plan"),
  heightCm: integer("height_cm"),
  weightKg: integer("weight_kg"),
  age: integer("age"),
  bmi: numeric("bmi", { precision: 4, scale: 1 }),
  // Cribado clínico GLP-1.
  sex: text("sex"),
  pregnancy: text("pregnancy"),
  comorbidities: text("comorbidities"), // JSON array de ids
  contraindications: text("contraindications"), // JSON array de ids
  eligibility: text("eligibility"), // 'eligible' | 'review' | 'blocked'
  eligibilityReason: text("eligibility_reason"), // JSON array de motivos
  source: text("source").default("quiz"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert

/**
 * Registros de progreso que introduce el propio paciente durante el tratamiento.
 * Solo el paciente escribe; su médico asignado puede leerlos.
 */
export const progressEntries = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  weightKg: numeric("weight_kg", { precision: 5, scale: 1 }),
  waistCm: numeric("waist_cm", { precision: 5, scale: 1 }),
  dose: text("dose"),
  sideEffects: text("side_effects"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type ProgressEntry = typeof progressEntries.$inferSelect
export type NewProgressEntry = typeof progressEntries.$inferInsert

/**
 * Notas que el médico escribe sobre un paciente.
 * visibility: 'internal' (solo equipo médico) | 'shared' (visible para el paciente).
 */
export const doctorNotes = pgTable("doctor_notes", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  body: text("body").notNull(),
  visibility: text("visibility").notNull().default("internal"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type DoctorNote = typeof doctorNotes.$inferSelect
export type NewDoctorNote = typeof doctorNotes.$inferInsert

/**
 * Verificación adicional que un médico solicita a un paciente cuando sospecha
 * que los datos pueden no ser veraces (p. ej. un vídeo, una analítica, etc.).
 * Mientras exista una solicitud sin aprobar, el paciente no puede activar la
 * suscripción del tratamiento.
 * status: 'pending' (esperando que el paciente suba) | 'submitted' (subido,
 * pendiente de revisión) | 'approved' | 'rejected'.
 */
export const verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  patientId: text("patientId").notNull(),
  doctorId: text("doctorId").notNull(),
  message: text("message").notNull(), // qué pide el médico
  status: text("status").notNull().default("pending"),
  blobPathname: text("blob_pathname"), // archivo subido por el paciente (privado)
  fileName: text("file_name"),
  fileType: text("file_type"),
  reviewNote: text("review_note"), // motivo del rechazo / nota de revisión
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type VerificationRequest = typeof verificationRequests.$inferSelect
export type NewVerificationRequest = typeof verificationRequests.$inferInsert

/**
 * Suscriptores de newsletter capturados desde la guía «Equilibra tus hormonas»
 * y otros CTAs del sitio público. No requieren cuenta de usuario.
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("guia"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert
