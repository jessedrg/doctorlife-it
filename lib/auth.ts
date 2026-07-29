import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"

/** Scopes de Google Calendar que pide el médico al conectar su cuenta. */
const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
]

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ to: user.email, name: user.name, url })
    },
  },
  // Google solo se usa para que el médico enlace su Calendar/Meet (no es un
  // método de inicio de sesión). Se registra únicamente si hay credenciales.
  ...(googleConfigured
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // Scopes adicionales de Calendar/Meet, además de email/profile.
            scope: GOOGLE_CALENDAR_SCOPES,
            // offline + consent garantizan que Google entregue un refresh_token
            // (necesario para crear eventos sin que el médico esté presente).
            accessType: "offline" as const,
            prompt: "consent" as const,
          },
        },
        account: {
          accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
            // El email con el que el médico inicia sesión (p. ej. su correo
            // profesional) no tiene por qué coincidir con la cuenta de Google
            // que conecta para Calendar/Meet. Sin esto, Better Auth rechaza el
            // enlace con "email_doesn't_match" y nunca guarda los tokens.
            allowDifferentEmails: true,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      // 'patient' | 'doctor' | 'admin'. Defaults to patient and is NOT
      // settable from the client sign-up payload (input: false) so a user
      // cannot self-assign the doctor/admin role.
      role: {
        type: "string",
        required: false,
        defaultValue: "patient",
        input: false,
      },
    },
  },
  trustedOrigins: [
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    // Dominios propios del proyecto.
    "https://doctorlife.io",
    "https://www.doctorlife.io",
    "https://dev.doctorlife.io",
    // Preview de v0 (el iframe se sirve desde subdominios de vusercontent.net)
    // y los preview deployments de Vercel.
    "https://*.vusercontent.net",
    "https://*.vercel.app",
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // Límite de peticiones más permisivo (entorno de pruebas) para no bloquear
  // tras unos pocos intentos de inicio de sesión.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 30 },
    },
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
