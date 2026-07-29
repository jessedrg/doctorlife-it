import { redirect } from "next/navigation"
import { getSessionUser, homePathForRole } from "@/lib/session"
import { RequestResetForm } from "@/components/request-reset-form"

export const metadata = { title: "Recuperar contraseña — DoctorLife" }

export default async function RecuperarPage() {
  const user = await getSessionUser()
  if (user) redirect(homePathForRole(user.role))
  return <RequestResetForm />
}
