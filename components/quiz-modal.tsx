"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuiz } from "./quiz-context";
import { products, adsProducts } from "@/lib/data";
import { saveLead } from "@/app/actions/leads";
import { getPublicSlots, startPublicCheckout } from "@/app/actions/public-booking";
import type { PooledSlot } from "@/lib/scheduling/types";
import { BrandLogo } from "./brand-logo";
import { analytics } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Telefono italiano o internazionale: 9-15 cifre, ammette +, spazi e trattini.
const PHONE_RE = /^\+?[\d\s-]{9,17}$/;

// Formulario de UNA sola página: datos mínimos → elegir cita → hecho.
type Phase = "form" | "submitting" | "slot" | "done";

export function QuizModal() {
  const t = useTranslations("quiz.quiz");
  const tw = useTranslations("ui.whatsapp");
  const { open, initialPlan, closeQuiz, variant } = useQuiz();
  const isAds = variant === "ads";
  const productList = isAds ? adsProducts : products;
  const WA_QUIZ_URL = `https://wa.me/39?text=${encodeURIComponent(tw("defaultMessage"))}`;

  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<PooledSlot[] | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const phoneRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPhase("form");
    setName("");
    setPhone("");
    setEmail("");
    setHeight("");
    setWeight("");
    setError(null);
    setSlots(null);
    setActiveDate(null);
    setPaying(false);
  };

  // Solo hay un plan contratable: el destacado. Va implícito, sin pantalla de selección.
  const mainPlan = useMemo(
    () => productList.find((p) => !p.comingSoon) ?? productList[0],
    [productList],
  );

  // Agrupa los huecos por día para el selector de cita.
  const slotsByDate = useMemo(() => {
    const map = new Map<string, PooledSlot[]>();
    for (const s of slots ?? []) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [slots]);

  useEffect(() => {
    if (open) {
      setPhase("form");
      analytics.formOpened(initialPlan ?? undefined);
    }
  }, [open, initialPlan]);

  const close = () => {
    if (phase === "form" || phase === "slot") {
      analytics.formAbandoned(phase);
    }
    closeQuiz();
    setTimeout(reset, 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const bmi = h > 0 && w > 0 ? w / Math.pow(h / 100, 2) : null;

  if (!open) return null;

  const bmiCategory = (b: number) =>
    b < 18.5
      ? { label: t("form.bmiUnderweight"), color: "text-amber" }
      : b < 25
        ? { label: t("form.bmiHealthy"), color: "text-olive" }
        : b < 30
          ? { label: t("form.bmiOverweight"), color: "text-amber" }
          : { label: t("form.bmiObesity"), color: "text-clay" };

  const submit = async () => {
    setError(null);
    if (!(h > 0 && w > 0)) {
      setError(t("form.errorHeightWeight"));
      return;
    }
    if (!PHONE_RE.test(phone.trim())) {
      setError(t("form.errorPhone"));
      phoneRef.current?.focus();
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(t("form.errorEmail"));
      return;
    }
    setPhase("submitting");
    const res = await saveLead({
      name,
      email,
      phone,
      goal: t("form.goal"),
      formatPreference: t("form.formatPreference"),
      plan: mainPlan?.name,
      heightCm: h > 0 ? h : null,
      weightKg: w > 0 ? w : null,
    });
    if (!res.ok) {
      setError(res.error);
      setPhase("form");
      return;
    }
    setPhase("slot");
    analytics.formStep("slot");
    try {
      const available = await getPublicSlots(14);
      setSlots(available);
      setActiveDate(available[0]?.date ?? null);
    } catch {
      setSlots([]);
    }
  };

  const payForSlot = async (startUtc: string) => {
    setError(null);
    setPaying(true);
    try {
      const result = await startPublicCheckout({ name, email, startUtcISO: startUtc });
      if ("url" in result) {
        analytics.formCompleted({ source: mainPlan?.name });
        window.location.href = result.url;
        return;
      }
      setError(result.error);
    } catch {
      setError(t("slot.errorCheckout"));
    }
    setPaying(false);
  };

  const activeSlots = slotsByDate.find(([d]) => d === activeDate)?.[1] ?? [];

  const inputClass =
    "rounded-[14px] border border-ink/15 bg-warm px-[18px] py-4 text-[16px] text-ink outline-none transition-colors focus:border-amber disabled:opacity-60";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{ background: "rgba(23,16,9,.45)", backdropFilter: "blur(6px)" }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={t("ariaLabel")}
    >
      <div
        className="quiz-card flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[28px] bg-paper sm:max-h-[88dvh] sm:rounded-[26px]"
        style={{ boxShadow: "0 40px 90px rgba(0,0,0,.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto overscroll-contain px-6 pb-7 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
          <div aria-hidden className="mx-auto mb-4 h-1 w-12 rounded-full bg-ink/15 sm:hidden" />
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <BrandLogo markSize={24} textSize={17} textClassName="text-ink" />
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-ink/15 text-[15px] text-ink transition-colors hover:bg-warm active:bg-warm"
            >
              ✕
            </button>
          </div>

          {/* FORM — todo en una sola página */}
          {(phase === "form" || phase === "submitting") && (
            <div className="quiz-fade">
              <h3 className="text-[24px] font-light leading-[1.14] tracking-[-.02em] text-balance sm:text-[27px]">
                {t("form.title")}
              </h3>
              <p className="mb-5 mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                {t("form.subtitle")}
              </p>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                    {t("form.height")}
                    <input
                      value={height}
                      onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder="170"
                      disabled={phase === "submitting"}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                    {t("form.weight")}
                    <input
                      value={weight}
                      onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder="75"
                      disabled={phase === "submitting"}
                      className={inputClass}
                    />
                  </label>
                </div>

                {bmi && (
                  <div className="flex items-center justify-between rounded-[14px] border border-sage/40 bg-sage/10 px-[18px] py-3">
                    <span className="text-[13.5px] text-ink-soft">{t("form.bmiLabel")}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-[19px] font-semibold text-ink">{bmi.toFixed(1)}</span>
                      <span className={`text-[13px] font-medium ${bmiCategory(bmi).color}`}>
                        {bmiCategory(bmi).label}
                      </span>
                    </span>
                  </div>
                )}

                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                  {t("form.phone")}
                  <input
                    ref={phoneRef}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^\d+\s-]/g, ""));
                      if (error) setError(null);
                    }}
                    inputMode="tel"
                    type="tel"
                    autoComplete="tel"
                    placeholder="600 000 000"
                    disabled={phase === "submitting"}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                  {t("form.email")}
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !(e.nativeEvent as KeyboardEvent).isComposing && e.keyCode !== 229) submit();
                    }}
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    disabled={phase === "submitting"}
                    aria-invalid={!!error}
                    className={inputClass}
                  />
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.namePlaceholder")}
                  autoComplete="name"
                  disabled={phase === "submitting"}
                  className={inputClass}
                />

                {error && <p className="text-[13.5px] text-clay">{error}</p>}

                <button
                  type="button"
                  onClick={submit}
                  disabled={phase === "submitting"}
                  className="mt-1 flex items-center justify-center gap-2 rounded-[14px] bg-ink py-[17px] text-[16px] font-semibold text-paper transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-70"
                >
                  {phase === "submitting" ? (
                    <>
                      <span className="quiz-spinner h-[18px] w-[18px] rounded-full border-2 border-paper/30 border-t-paper" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </button>
              </div>

              <p className="mt-3.5 text-[12px] leading-relaxed text-ink-mute">
                {t("form.privacyText")}{" "}
                <a href="/privacidad" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  {t("form.privacyLink")}
                </a>
                {t("form.privacySuffix")}
              </p>

              {/* Atajo a WhatsApp */}
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/10" />
                <span className="text-[12px] text-ink-mute">{t("form.orPrefers")}</span>
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <button
                type="button"
                onClick={() => {
                  analytics.whatsappClicked("quiz");
                  window.open(WA_QUIZ_URL, "_blank");
                }}
                className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-ink/15 bg-warm py-[13px] text-[15px] font-medium text-ink transition-colors hover:border-[#25D366] hover:bg-cream"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5 fill-[#25D366]"
                  aria-hidden="true"
                >
                  <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.3l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.3 30 7.5 27.1 7.5 24 7.5 14.8 15 7.5 24 7.5S40.5 15 40.5 24 33 40 24 40zm10.8-13.4c-.6-.3-3.4-1.7-3.9-1.9-.5-.2-.9-.3-1.2.3-.4.6-1.4 1.9-1.7 2.2-.3.4-.6.4-1.1.1-.6-.3-2.4-.9-4.6-2.8-1.7-1.5-2.8-3.4-3.2-3.9-.3-.6 0-.9.3-1.1l.9-1.1c.2-.3.3-.6.5-.9.2-.3.1-.6 0-.9-.1-.2-1.2-2.9-1.6-3.9-.4-1-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.4.7-.5.5-1.8 1.8-1.8 4.3s1.9 5 2.1 5.4c.3.3 3.7 5.7 9 8 1.3.5 2.3.8 3 1.1 1.3.4 2.4.3 3.3.2 1-.2 3.1-1.3 3.5-2.5.4-1.2.4-2.2.3-2.5-.1-.3-.5-.4-1-.7z" />
                </svg>
                {t("form.whatsappCta")}
              </button>
            </div>
          )}

          {/* SLOT: elegir hora */}
          {phase === "slot" && (
            <div className="quiz-fade">
              <h3 className="text-[23px] font-light tracking-[-.02em] sm:text-[26px]">{t("slot.title")}</h3>
              <p className="mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-soft">
                {t("slot.subtitle")}{" "}
                <span className="font-medium text-ink">{t("slot.subtitleHighlight")}</span>{t("slot.subtitleSuffix")}
              </p>

              {slots === null ? (
                <div className="flex items-center justify-center py-12 text-ink-mute">
                  <span className="quiz-spinner mr-2 inline-block h-5 w-5 rounded-full border-2 border-ink/20 border-t-ink/60" />
                  {t("slot.loading")}
                </div>
              ) : slotsByDate.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-ink/10 bg-ink/[.04] p-6 text-center">
                  <p className="text-[15px] font-medium text-ink">
                    {t("slot.noSlotsTitle")}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                    {t("slot.noSlotsDesc")}
                  </p>
                  <a
                    href={`https://wa.me/39?text=${encodeURIComponent(tw("noSlotsMessage", { name: name || "…" }))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
                    onClick={() => analytics.whatsappClicked("no_slots_quiz")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 fill-white" aria-hidden="true">
                      <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.3l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.3 30 7.5 27.1 7.5 24 7.5 14.8 15 7.5 24 7.5S40.5 15 40.5 24 33 40 24 40zm10.8-13.4c-.6-.3-3.4-1.7-3.9-1.9-.5-.2-.9-.3-1.2.3-.4.6-1.4 1.9-1.7 2.2-.3.4-.6.4-1.1.1-.6-.3-2.4-.9-4.6-2.8-1.7-1.5-2.8-3.4-3.2-3.9-.3-.6 0-.9.3-1.1l.9-1.1c.2-.3.3-.6.5-.9.2-.3.1-.6 0-.9-.1-.2-1.2-2.9-1.6-3.9-.4-1-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.4.7-.5.5-1.8 1.8-1.8 4.3s1.9 5 2.1 5.4c.3.3 3.7 5.7 9 8 1.3.5 2.3.8 3 1.1 1.3.4 2.4.3 3.3.2 1-.2 3.1-1.3 3.5-2.5.4-1.2.4-2.2.3-2.5-.1-.3-.5-.4-1-.7z" />
                    </svg>
                    {t("slot.whatsappCta")}
                  </a>
                  <p className="mt-3 text-[12px] text-ink-mute">
                    {t("slot.emailText")}{" "}
                    <a href="mailto:hola@doctorlife.app" className="underline underline-offset-2 hover:text-ink">
                      hola@doctorlife.app
                    </a>
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    {slotsByDate.map(([date, list]) => {
                      const d = new Date(list[0].startUtc);
                      const active = date === activeDate;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => setActiveDate(date)}
                          className={`shrink-0 rounded-xl px-3.5 py-2 text-center transition-colors ${
                            active ? "bg-ink text-paper" : "bg-ink/[.05] text-ink-soft hover:bg-ink/10"
                          }`}
                        >
                          <span className="block text-[11px] uppercase tracking-wide opacity-70">
                            {d.toLocaleDateString("it-IT", { weekday: "short" })}
                          </span>
                          <span className="block text-[15px] font-medium">
                            {d.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {activeSlots.map((s) => (
                      <button
                        key={s.startUtc}
                        type="button"
                        disabled={paying}
                        onClick={() => {
                          // Métrica: cita seleccionada
                          analytics.formPhaseSlot(s.startUtc);
                          payForSlot(s.startUtc);
                        }}
                        className="rounded-xl border border-ink/12 py-2.5 text-[14.5px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink/[.04] disabled:opacity-50"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              {paying && <p className="mt-4 text-center text-sm text-ink-mute">{t("slot.confirming")}</p>}

              <button
                type="button"
                onClick={() => setPhase("form")}
                disabled={paying}
                className="mt-4 text-sm text-ink-mute hover:text-ink disabled:opacity-50"
              >
                {t("slot.back")}
              </button>
            </div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <div className="quiz-fade py-[14px] text-center">
              <div
                className="mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full text-[38px] text-white"
                style={{ background: "radial-gradient(60% 60% at 38% 32%,#cdd9a0,#9aa472 60%,#5f6a3e)" }}
              >
                ✓
              </div>
              <h3 className="mb-[10px] mt-6 text-[27px] font-light tracking-[-.02em] sm:text-[30px]">
                {name ? t("done.thanks", { name: name.split(" ")[0] }) : t("done.allSet")}
              </h3>
              <p className="mx-auto mb-6 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-soft">
                {t("done.message")}{" "}
                <span className="font-medium text-ink">{email}</span> {t("done.messageSuffix")}
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-amber px-[38px] py-[15px] text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("done.done")}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .quiz-card {
          animation: quizIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .quiz-fade {
          animation: quizFade 0.28s ease;
        }
        .quiz-spinner {
          animation: quizSpin 0.7s linear infinite;
        }
        @keyframes quizIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes quizFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes quizSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
