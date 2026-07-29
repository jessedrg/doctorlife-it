import { requireRole } from "@/lib/session"
import { ChangePasswordForm } from "@/components/change-password-form"
import { DoctorProfileForm } from "@/components/doctor-profile-form"
import { GoogleCalendarConnect } from "@/components/google-calendar-connect"
import { getGoogleConnectionStatus } from "@/app/actions/google-connection"
import { getMyDoctorProfileWithImage } from "@/app/actions/doctor"

export const metadata = { title: "Mi cuenta — DoctorLife" }

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[22px] border border-ink/10 bg-cream p-6 sm:p-7">
      <h2 className="text-[18px] font-medium text-ink">{title}</h2>
      {description && (
        <p className="mt-1 max-w-[60ch] text-[14px] leading-relaxed text-ink-soft">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default async function MedicoAccountPage() {
  await requireRole("doctor")
  const [profile, googleStatus] = await Promise.all([
    getMyDoctorProfileWithImage(),
    getGoogleConnectionStatus(),
  ])

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Mi cuenta
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Tu usuario es <span className="font-medium text-ink">{profile.email}</span>. Gestiona tu
        perfil público, calendario y contraseña.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        <Section
          title="Perfil"
          description="Esta información y tu foto se muestran a tus pacientes, incluido el chat."
        >
          <DoctorProfileForm
            profile={{
              fullName: profile.fullName,
              specialty: profile.specialty,
              licenseNumber: profile.licenseNumber,
              bio: profile.bio,
              acceptingPatients: profile.acceptingPatients,
              maxPatients: profile.maxPatients,
              image: profile.image,
            }}
          />
        </Section>

        <Section title="Videollamadas" description="Conecta tu calendario para generar enlaces de videollamada.">
          <GoogleCalendarConnect status={googleStatus} />
        </Section>

        <Section title="Cambiar contraseña">
          <ChangePasswordForm />
        </Section>
      </div>
    </div>
  )
}
