import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./reveal";
import { experts } from "@/lib/data";

export async function Experts() {
  const t = await getTranslations("ui.experts");
  return (
    <section id="experts" className="mx-auto max-w-none scroll-mt-[90px] px-3 pb-10 pt-[104px] text-center sm:px-4 lg:px-5">
      <Reveal>
        <h2 className="m-0 text-[clamp(34px,5vw,68px)] font-light leading-[.98] tracking-[-.025em]">
          {t("titleLine1")}
          <br />
          {t("titleLine2")} <span className="font-serif italic text-clay">{t("titleLine3")}</span>
        </h2>
        <p className="mx-auto mt-[18px] max-w-[48ch] text-[17px] font-light text-ink-soft">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-[54px] grid grid-cols-2 gap-[18px] text-left sm:grid-cols-3 lg:grid-cols-5">
        {experts.map((e: typeof experts[number]) => (
          <div key={e.name} className="overflow-hidden rounded-[24px] bg-cream">
            <div className="relative h-[190px] w-full overflow-hidden bg-cream-2">
              <Image
                src={e.img}
                alt={e.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-top"
              />
            </div>
            <div className="p-[18px]">
              <div className="text-base font-medium">{e.name}</div>
              <div className="mt-[3px] text-[13px] text-clay">{e.role}</div>
              <div className="mt-2 text-[13px] leading-[1.4] text-ink-mute">{e.spec}</div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
