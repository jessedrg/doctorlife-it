import { getTranslations } from "next-intl/server";
import { Reveal } from "./reveal";

/**
 * Sezione informativa (non pubblicitaria) sui trattamenti GLP-1.
 * Quadro legale: descrive la categoria e i principi attivi in modo oggettivo,
 * senza promuovere l'acquisto di un farmaco su prescrizione. Include disclaimer
 * che richiede ricetta e valutazione medica.
 */

type Principle = { activo: string; clase: string; desc: string; admin: string };

export async function Glp1Info() {
  const t = await getTranslations("glp1Info");
  const principles = t.raw("principles") as Principle[];

  return (
    <section
      id="glp1"
      className="scroll-mt-[90px] bg-paper px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[900px]">
        <Reveal>
          <div className="text-[13px] uppercase tracking-[.16em] text-ink-mute">
            {t("badge")}
          </div>
          <h2 className="mt-[10px] max-w-[16ch] text-[clamp(28px,4vw,46px)] font-light leading-[1.02] tracking-[-.02em] text-ink text-balance">
            {t("title")}{" "}
            <span className="font-serif italic">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
            {t("intro")}
          </p>
        </Reveal>

        <Reveal className="mt-9">
          <div className="grid gap-3 sm:grid-cols-3">
            {principles.map((p) => (
              <div
                key={p.activo}
                className="flex flex-col rounded-2xl border border-ink/10 bg-warm p-5"
              >
                <div className="text-[11px] uppercase tracking-[.12em] text-olive">
                  {p.clase}
                </div>
                <div className="mt-1 text-[19px] font-medium leading-tight text-ink">
                  {p.activo}
                </div>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                  {p.desc}
                </p>
                <div className="mt-3 text-[12.5px] font-medium text-ink-mute">
                  {p.admin}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-ink-mute">
            {t("disclaimer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
