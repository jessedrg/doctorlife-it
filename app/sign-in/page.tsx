import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser, homePathForRole } from "@/lib/session"

export const metadata = { title: "Iniciar sesión — DoctorLife" }

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect(homePathForRole(user.role))
  return <AuthForm />
}
