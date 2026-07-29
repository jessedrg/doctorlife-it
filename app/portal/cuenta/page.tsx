import { requireRole } from "@/lib/session"
import { ChangePasswordForm } from "@/components/change-password-form"

export const metadata = { title: "Mi cuenta — DoctorLife" }

export default async function PortalAccountPage() {
  const user = await requireRole("patient")

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Mi cuenta
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Tu usuario es <span className="font-medium text-ink">{user.email}</span>. Aquí puedes cambiar tu contraseña.
      </p>

      <div className="mt-7">
        <h2 className="text-[18px] font-medium text-ink">Cambiar contraseña</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
