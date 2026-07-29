import { getTranslations } from "next-intl/server"

export async function MedicalTeamSection({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("ui.medicalTeam")
  return (
    <section className={compact ? "bg-cream" : "bg-paper"} aria-labelledby="medical-team-heading">
      <div className="mx-auto max-w-[720px] px-5 py-16 text-center sm:py-20">
        <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-olive">
          {t("badge")}
        </span>
        <h2
          id="medical-team-heading"
          className="mt-3 text-balance text-[clamp(26px,3.6vw,40px)] font-light leading-[1.1] tracking-[-0.03em] text-ink"
        >
          {t("title")}
        </h2>
        <p className="mt-5 text-[20px] font-medium text-ink">{t("doctorName")}</p>
        <p className="mt-1 text-[15px] text-ink-soft">
          {t("doctorRole")}
        </p>
      </div>
    </section>
  )
}
