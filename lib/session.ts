import "server-only"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export type Role = "patient" | "doctor" | "admin"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
  image?: string | null
}

/** Returns the current session user, or null if not authenticated. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as unknown as SessionUser & { role?: string }
  return { ...u, role: (u.role as Role) ?? "patient" }
}

/** Throws Unauthorized — for use inside server actions. */
export async function requireUserId(): Promise<string> {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

/** Redirects to /sign-in if not authenticated. Returns the user otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  return user
}

/**
 * Requires the user to have one of the allowed roles.
 * Redirects unauthenticated users to /sign-in and wrong-role users to their
 * own home so a patient cannot land on a doctor/admin route.
 */
export async function requireRole(allowed: Role | Role[]): Promise<SessionUser> {
  const user = await requireUser()
  const roles = Array.isArray(allowed) ? allowed : [allowed]
  if (!roles.includes(user.role)) redirect(homePathForRole(user.role))
  return user
}

/** Default landing path per role. */
export function homePathForRole(role: Role): string {
  switch (role) {
    case "doctor":
      return "/clinica"
    case "admin":
      return "/admin"
    default:
      return "/portal"
  }
}
