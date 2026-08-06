import { requireRole } from "@/lib/session"
import { ChangePasswordForm } from "@/components/change-password-form"
import { DoctorProfileForm } from "@/components/doctor-profile-form"
import { getMyDoctorProfileWithImage } from "@/app/actions/doctor"

export const metadata = { title: "Il mio account — DoctorLife" }

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
  const profile = await getMyDoctorProfileWithImage()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Il mio account
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Il tuo utente è <span className="font-medium text-ink">{profile.email}</span>. Gestisci il tuo
        profilo pubblico, il calendario e la password.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        <Section
          title="Profilo"
          description="Queste informazioni e la tua foto vengono mostrate ai tuoi pazienti, anche nella chat."
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

        <Section title="Cambia password">
          <ChangePasswordForm />
        </Section>
      </div>
    </div>
  )
}
