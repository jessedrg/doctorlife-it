import { track } from "@vercel/analytics";

/** Acción de conversión de Google Ads para "Envío de formulario para clientes potenciales". */
const GOOGLE_ADS_SEND_TO = "AW-18265536787/YUdjCIvbmMQcEJPy14VE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Dispara la conversión de Google Ads de "formulario completado". */
function fireGoogleAdsConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
    value: 1.0,
    currency: "EUR",
  });
}

/**
 * Custom events centralizados para DoctorLife.
 *
 * Usamos Vercel Analytics (`track`) para medir el embudo:
 *  - cuánta gente abre el formulario (y desde dónde)
 *  - el avance por los pasos del quiz
 *  - cuántos completan el formulario (leads)
 *  - la aparición / interacción con el popup del blog
 *  - la navegación desde el blog hacia la página principal
 *
 * Los valores de las propiedades solo pueden ser string | number | boolean | null.
 */

function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

/** ¿El usuario está navegando dentro del blog? */
function isBlog(): boolean {
  return currentPath().startsWith("/blog");
}

export const analytics = {
  /** El usuario abrió el formulario/quiz. `source` = plan o lugar desde donde se abrió. */
  formOpened(source?: string | null) {
    track("form_opened", {
      source: source ?? "navbar",
      path: currentPath(),
      from_blog: isBlog(),
    });
  },

  /** Avance dentro del quiz (p. ej. "bmi", "details"). */
  formStep(step: string) {
    track("form_step", { step, path: currentPath() });
  },

  /** El usuario completó el formulario (lead creado). */
  formCompleted(meta?: { source?: string | null; timeline?: string | null }) {
    track("form_completed", {
      source: meta?.source ?? "unknown",
      timeline: meta?.timeline ?? null,
      from_blog: isBlog(),
    });
    // Conversión de Google Ads
    fireGoogleAdsConversion();
  },

  /** Apareció la card de conversión del blog tras un rato navegando. */
  blogPopupShown() {
    track("blog_popup_shown", { path: currentPath() });
  },

  /** El usuario navegó desde el blog hacia la página principal. */
  blogToHome(target: string) {
    track("blog_to_home", { target, from: currentPath() });
  },

  /**
   * El usuario respondió una pregunta del quiz.
   * `stepIndex` es 0-based; `key` es el identificador semántico del paso.
   * Permite construir un funnel de abandono pregunta a pregunta.
   */
  quizQuestion(stepIndex: number, key: string, answer: string, totalSteps: number) {
    track("quiz_question_answered", {
      step_index: stepIndex,
      step_key: key,
      step_label: `${stepIndex + 1}/${totalSteps}`,
      answer,
      path: currentPath(),
    });
  },

  /**
   * El usuario cerró el modal antes de completar el formulario.
   * `phase` indica en qué fase estaba (questions, profile, measures, etc.).
   * `stepIndex` solo es relevante cuando phase === "questions".
   */
  formAbandoned(phase: string, stepIndex?: number) {
    track("form_abandoned", {
      phase,
      step_index: stepIndex ?? null,
      path: currentPath(),
    });
  },

  /** El usuario completó la fase de PROFILE (edad, sexo, embarazo). */
  formPhaseProfile(age: number | null, sex: string | null, pregnancy: string | null) {
    track("form_phase_profile", {
      age: age ?? null,
      sex: sex ?? null,
      pregnancy: pregnancy ?? null,
      path: currentPath(),
    });
  },

  /** El usuario completó la fase de MEASURES (altura, peso, IMC). */
  formPhaseMeasures(heightCm: number | null, weightKg: number | null, bmi: number | null) {
    track("form_phase_measures", {
      height_cm: heightCm ?? null,
      weight_kg: weightKg ?? null,
      bmi: bmi?.toFixed(1) ?? null,
      path: currentPath(),
    });
  },

  /** El usuario seleccionó comorbilidades (condiciones de salud). */
  formPhaseComorbidities(selectedComorbidities: string[]) {
    track("form_phase_comorbidities", {
      comorbidities_count: selectedComorbidities.length,
      comorbidities: selectedComorbidities.join(","),
      path: currentPath(),
    });
  },

  /** El usuario completó la fase de CONTRAINDICATIONS (verificación de seguridad). */
  formPhaseContraindications(contraindications: string[]) {
    track("form_phase_contraindications", {
      contraindications_count: contraindications.length,
      contraindications: contraindications.join(","),
      path: currentPath(),
    });
  },

  /** El usuario vio el resultado de eligibilidad (eligible o blocked). */
  formPhaseResult(eligibility: "eligible" | "blocked", reason?: string) {
    track("form_phase_result", {
      eligibility,
      reason: reason ?? null,
      path: currentPath(),
    });
  },

  /** El usuario eligió un plan de tratamiento. */
  formPhasePlan(selectedPlan: string) {
    track("form_phase_plan", {
      plan: selectedPlan,
      path: currentPath(),
    });
  },

  /** El usuario ingresó email y nombre en detalles. */
  formPhaseDetails(email: string, name: string) {
    track("form_phase_details", {
      email,
      name,
      path: currentPath(),
    });
  },

  /** El usuario eligió una cita. */
  formPhaseSlot(slotDateTime: string) {
    track("form_phase_slot", {
      slot: slotDateTime,
      path: currentPath(),
    });
  },

  /** El usuario hizo clic en el botón de WhatsApp. */
  whatsappClicked(source: "button" | "tooltip" | "sticky_bar") {
    track("whatsapp_clicked", { source, path: currentPath() });
    // Fire Google Ads conversion — same weight as form lead
    fireGoogleAdsConversion();
  },
};
