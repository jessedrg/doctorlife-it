import { getTranslations } from "next-intl/server";
import { TrustBox } from "./trustbox";

export async function Hero() {
  const t = await getTranslations("ui.hero");
  return (
    <section
      id="top"
      className="mx-auto mt-5 max-w-none scroll-mt-[100px] px-3 sm:px-4 lg:px-5"
    >
      {/*
        The card top offset from page top = announcement bar + navbar + mt-5 section.
        Measured: ~150px on desktop. We add 12px bottom gap.
        100svh already accounts for mobile browser bar being visible.
        On mobile we reduce offset since there's no announcement bar.
      */}
      <div
        className="relative w-full overflow-hidden rounded-[36px]"
        style={{ height: "calc(100svh - 162px)" }}
      >
        {/* base brand color block */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(155deg,#6b774a 0%,#5f6a3e 45%,#454d2e 100%)" }}
        />

        {/* foto principal */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[58%] xl:w-[55%] 2xl:w-[52%]">
          <img
            src="/hero/woman.png"
            alt={t("altImage")}
            className="h-full w-full object-cover"
            style={{ objectPosition: "65% top" }}
          />
          {/* color overlay para fundir la foto con el bloque */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(95deg,#5f6a3e 0%,rgba(95,106,62,.45) 20%,rgba(95,106,62,.06) 45%,transparent 70%)" }}
          />
        </div>

        {/* contenido */}
        <div className="relative z-[2] flex h-full flex-col justify-center px-5 pb-10 pt-10 sm:px-10 lg:px-14 2xl:px-20">
          <div className="max-w-[600px] 2xl:max-w-[720px]">
            <div className="text-[13px] font-semibold uppercase tracking-[.18em] text-sage 2xl:text-[15px]">
              {t("badge")}
            </div>
            <h1 className="mt-4 text-balance text-[clamp(30px,5vw,84px)] font-light leading-[1.02] tracking-[-.03em] text-paper sm:mt-6">
              {t("title")}{" "}
              <span className="font-serif italic text-sage">{t("titleHighlight")}</span>{t("titleSuffix")}
            </h1>
            <p className="mt-4 max-w-[40ch] text-balance text-[clamp(15px,1.4vw,24px)] font-light leading-[1.5] text-paper/80 sm:mt-7">
              {t("subtitle")}
            </p>
            <TrustBox theme="dark" alignment="left" className="mt-6 max-w-[280px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
