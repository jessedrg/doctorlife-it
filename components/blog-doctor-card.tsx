import Image from "next/image"
import { getTranslations } from "next-intl/server"

/**
 * Tarjeta editorial "Conoce a nuestro médico" para los artículos del blog pSEO.
 * Presenta al Dr. Miguel A. Guirola de forma breve, reforzando E-E-A-T y la
 * confianza del lector. Diseñada para el ancho del artículo (~760px).
 */
export async function BlogDoctorCard() {
  const t = await getTranslations("ui.blogDoctorCard")
  return (
    <aside className="mt-14 overflow-hidden rounded-[24px] border border-ink/10 bg-warm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="relative mx-auto h-[150px] w-[150px] flex-shrink-0 overflow-hidden rounded-[20px] bg-cream-2 sm:mx-0">
          <Image
            src="/images/miguel-guirola.jpeg"
            alt={t("imageAlt")}
            fill
            sizes="150px"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-olive">
            {t("kicker")}
          </span>
          <p className="mt-2 text-[20px] font-medium leading-tight text-ink">
            {t("doctorName")}
          </p>
          <p className="mt-1 text-[14.5px] text-ink-soft">
            {t("doctorTitle")}
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
            {t("bio")}
          </p>
        </div>
      </div>
    </aside>
  )
}
