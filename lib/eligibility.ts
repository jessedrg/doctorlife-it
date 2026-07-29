/* ───────────────────────────────────────────────────────────
   Cribado clínico de elegibilidad para tratamiento con GLP-1
   (semaglutida / liraglutida) en control de peso.

   Criterios orientados a la indicación EMA en obesidad/sobrepeso:
   - Edad >= 18.
   - Elegible por IMC: IMC >= 30, o IMC >= 27 con >=1 comorbilidad
     relacionada con el peso.

   El resultado es ORIENTATIVO. La decisión final es siempre del
   endocrino colegiado en la consulta. Esta función es pura y se
   usa tanto en cliente como en servidor (no confiar solo en el
   cliente: se re-evalúa en saveLead).
   ─────────────────────────────────────────────────────────── */

export type Comorbidity = { id: string; label: string }
export type Contraindication = { id: string; label: string; severity: "absolute" | "relative" }

/** Comorbilidades relacionadas con el peso (bajan el umbral de IMC a 27). */
export const COMORBIDITIES: Comorbidity[] = [
  { id: "hypertension", label: "Hipertensión arterial" },
  { id: "type2_diabetes", label: "Diabetes tipo 2" },
  { id: "prediabetes", label: "Prediabetes" },
  { id: "dyslipidemia", label: "Colesterol o triglicéridos altos" },
  { id: "sleep_apnea", label: "Apnea del sueño" },
  { id: "fatty_liver", label: "Hígado graso" },
  { id: "pcos", label: "Síndrome de ovario poliquístico (SOP)" },
  { id: "cardiovascular", label: "Enfermedad cardiovascular" },
  { id: "osteoarthritis", label: "Artrosis relacionada con el peso" },
]

/**
 * Antecedentes y contraindicaciones.
 * - absolute: bloquea el tratamiento (no se permite reservar).
 * - relative: requiere valoración médica (permite reservar, marca el lead).
 */
export const CONTRAINDICATIONS: Contraindication[] = [
  { id: "mtc", label: "Antecedente personal o familiar de cáncer medular de tiroides (CMT)", severity: "absolute" },
  { id: "men2", label: "Neoplasia endocrina múltiple tipo 2 (MEN2)", severity: "absolute" },
  { id: "glp1_allergy", label: "Reacción alérgica grave previa a un GLP-1", severity: "absolute" },
  { id: "pancreatitis", label: "Pancreatitis (antecedente)", severity: "relative" },
  { id: "gallbladder", label: "Enfermedad de la vesícula biliar", severity: "relative" },
  { id: "type1_diabetes", label: "Diabetes tipo 1", severity: "relative" },
  { id: "gastroparesis", label: "Gastroparesia o enfermedad digestiva grave", severity: "relative" },
  { id: "eating_disorder", label: "Trastorno de la conducta alimentaria", severity: "relative" },
  { id: "kidney_liver", label: "Insuficiencia renal o hepática grave", severity: "relative" },
]

export const ABSOLUTE_IDS = new Set(
  CONTRAINDICATIONS.filter((c) => c.severity === "absolute").map((c) => c.id),
)

export type EligibilityStatus = "eligible" | "review" | "blocked"

export type EligibilityInput = {
  age?: number | null
  heightCm?: number | null
  weightKg?: number | null
  pregnancy?: string | null // 'yes' | 'no' | 'planning' | null
  comorbidities?: string[]
  contraindications?: string[]
}

export type EligibilityResult = {
  status: EligibilityStatus
  reasons: string[]
  bmi: number | null
  eligibleByBmi: boolean
}

export function computeBmi(heightCm?: number | null, weightKg?: number | null): number | null {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null
  const bmi = weightKg / Math.pow(heightCm / 100, 2)
  return Math.round(bmi * 10) / 10
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = []
  const comorbidities = input.comorbidities ?? []
  const contraindications = input.contraindications ?? []
  const bmi = computeBmi(input.heightCm, input.weightKg)

  /* ---- Bloqueos absolutos ---- */
  if (input.age != null && input.age < 18) {
    reasons.push("El tratamiento solo está indicado para mayores de 18 años.")
    return { status: "blocked", reasons, bmi, eligibleByBmi: false }
  }
  if (input.pregnancy === "yes" || input.pregnancy === "planning") {
    reasons.push(
      "Los GLP-1 no se recomiendan durante el embarazo, la lactancia o si se busca un embarazo.",
    )
    return { status: "blocked", reasons, bmi, eligibleByBmi: false }
  }
  const absoluteHit = contraindications.filter((id) => ABSOLUTE_IDS.has(id))
  if (absoluteHit.length > 0) {
    for (const id of absoluteHit) {
      const c = CONTRAINDICATIONS.find((x) => x.id === id)
      if (c) reasons.push(`Contraindicación: ${c.label.toLowerCase()}.`)
    }
    return { status: "blocked", reasons, bmi, eligibleByBmi: false }
  }

  /* ---- Elegibilidad por IMC ---- */
  const hasComorbidity = comorbidities.length > 0
  const eligibleByBmi = bmi != null && (bmi >= 30 || (bmi >= 27 && hasComorbidity))

  /* ---- Banderas que requieren revisión médica ---- */
  const relativeHit = contraindications.filter((id) => !ABSOLUTE_IDS.has(id))
  let needsReview = false

  if (relativeHit.length > 0) {
    needsReview = true
    for (const id of relativeHit) {
      const c = CONTRAINDICATIONS.find((x) => x.id === id)
      if (c) reasons.push(`Requiere valoración por: ${c.label.toLowerCase()}.`)
    }
  }
  if (input.age != null && input.age > 75) {
    needsReview = true
    reasons.push("La edad requiere una valoración médica individualizada.")
  }
  if (bmi == null) {
    needsReview = true
    reasons.push("No hemos podido calcular tu IMC; un médico revisará tus datos.")
  } else if (!eligibleByBmi) {
    needsReview = true
    if (bmi < 27) {
      reasons.push(
        `Tu IMC (${bmi}) está por debajo del umbral habitual para el tratamiento; un médico valorará tu caso.`,
      )
    } else {
      reasons.push(
        `Con un IMC de ${bmi} se necesita una condición relacionada con el peso; un médico revisará tu caso.`,
      )
    }
  }

  if (needsReview) return { status: "review", reasons, bmi, eligibleByBmi }

  reasons.push(
    bmi != null && bmi >= 30
      ? `Tu IMC (${bmi}) cumple el criterio para el tratamiento.`
      : `Tu IMC (${bmi}) junto con tu perfil cumple el criterio para el tratamiento.`,
  )
  return { status: "eligible", reasons, bmi, eligibleByBmi }
}
