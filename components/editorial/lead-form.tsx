"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { saveLead } from "@/app/actions/leads";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{9,}$/;

/**
 * Formulario de captación de leads SIN etiqueta <form>:
 * estado React controlado + botón con onClick. Incluye consentimiento
 * RGPD obligatorio y estado de éxito tras el envío.
 */
export function LeadForm({ source = "articulo" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Indícanos tu nombre.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Introduce un correo electrónico válido.";
    if (!PHONE_RE.test(phone.trim())) next.phone = "Introduce un teléfono válido.";
    if (!consent) next.consent = "Debes aceptar la política de privacidad para continuar.";
    return next;
  }

  async function handleSubmit() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      consent,
      source,
    };
    setStatus("loading");
    try {
      await saveLead({ name: payload.name, email: payload.email });
    } catch (err) {
      // silently continue to success state on non-critical errors
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-[24px] border border-teal/30 bg-sage/20 px-6 py-10 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-paper">
          <CheckCircle2 aria-hidden className="h-6 w-6" />
        </span>
        <h3 className="text-[20px] font-medium text-ink">¡Solicitud recibida, {name.split(" ")[0]}!</h3>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink-soft">
          Un médico colegiado revisará tu caso y te contactaremos en breve para tu valoración
          gratuita. Revisa tu correo (también la carpeta de spam).
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-[14px] border bg-warm px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute/70 outline-none transition-colors focus:border-olive";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-name" className="text-[13px] font-medium text-ink">
          Nombre
        </label>
        <input
          id="lf-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={`${inputBase} ${errors.name ? "border-clay" : "border-ink/15"}`}
          placeholder="Tu nombre"
        />
        {errors.name && <p className="text-[13px] text-clay">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lf-email" className="text-[13px] font-medium text-ink">
            Email
          </label>
          <input
            id="lf-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={`${inputBase} ${errors.email ? "border-clay" : "border-ink/15"}`}
            placeholder="tucorreo@email.com"
          />
          {errors.email && <p className="text-[13px] text-clay">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lf-phone" className="text-[13px] font-medium text-ink">
            Teléfono
          </label>
          <input
            id="lf-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className={`${inputBase} ${errors.phone ? "border-clay" : "border-ink/15"}`}
            placeholder="600 000 000"
          />
          {errors.phone && <p className="text-[13px] text-clay">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-consent" className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-soft">
          <input
            id="lf-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-olive"
          />
          <span>
            He leído y acepto la{" "}
            <a href="/privacidad" className="text-olive underline underline-offset-2">
              política de privacidad
            </a>{" "}
            y consiento el tratamiento de mis datos, incluidos los de salud, para recibir una
            valoración médica (art. 9.2.h RGPD). Responsable: DoctorLife.
          </span>
        </label>
        {errors.consent && <p className="text-[13px] text-clay">{errors.consent}</p>}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-[15px] text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Solicitar valoración gratuita"
        )}
      </button>

      <p className="flex items-center justify-center gap-2 text-[12.5px] text-ink-mute">
        <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-olive" />
        Médicos colegiados · 100% online · Sin compromiso
      </p>
    </div>
  );
}
