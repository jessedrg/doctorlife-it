import Image from "next/image"

/**
 * Tarjeta editorial "Conoce a nuestro médico" para los artículos del blog pSEO.
 * Presenta al Dr. Miguel A. Guirola de forma breve, reforzando E-E-A-T y la
 * confianza del lector. Diseñada para el ancho del artículo (~760px).
 */
export function BlogDoctorCard() {
  return (
    <aside className="mt-14 overflow-hidden rounded-[24px] border border-ink/10 bg-warm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="relative mx-auto h-[150px] w-[150px] flex-shrink-0 overflow-hidden rounded-[20px] bg-cream-2 sm:mx-0">
          <Image
            src="/images/miguel-guirola.jpeg"
            alt="Dr. Miguel A. Guirola, médico especialista en obesidad de DoctorLife"
            fill
            sizes="150px"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-olive">
            Conoce a nuestro médico
          </span>
          <p className="mt-2 text-[20px] font-medium leading-tight text-ink">
            Dr. Miguel A. Guirola
          </p>
          <p className="mt-1 text-[14.5px] text-ink-soft">
            Médico especialista en obesidad · Médico de DoctorLife
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
            En DoctorLife tu tratamiento lo valora y supervisa nuestro médico especialista en
            obesidad, que te acompaña durante todo el seguimiento.
          </p>
        </div>
      </div>
    </aside>
  )
}
