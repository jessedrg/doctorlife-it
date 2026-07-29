import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export interface PrescriptionPdfData {
  doctorName: string
  doctorSpecialty?: string | null
  doctorLicense?: string | null
  patientName: string
  medication: string
  dosage: string
  instructions?: string | null
  issuedAt: Date
}

const INK = rgb(0.12, 0.13, 0.12)
const MUTED = rgb(0.4, 0.42, 0.4)
const SAGE = rgb(0.36, 0.49, 0.4)
const LINE = rgb(0.82, 0.82, 0.8)

/** Genera el PDF de una receta y devuelve los bytes. */
export async function buildPrescriptionPdf(data: PrescriptionPdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const marginX = 56
  let y = height - 64

  const text = (
    s: string,
    opts: { size?: number; font?: typeof font; color?: typeof INK; x?: number } = {},
  ) => {
    page.drawText(s, {
      x: opts.x ?? marginX,
      y,
      size: opts.size ?? 11,
      font: opts.font ?? font,
      color: opts.color ?? INK,
    })
  }

  // Encabezado
  text("DoctorLife", { size: 22, font: bold, color: SAGE })
  y -= 18
  text("Receta médica", { size: 12, color: MUTED })
  y -= 28

  page.drawLine({
    start: { x: marginX, y },
    end: { x: width - marginX, y },
    thickness: 1,
    color: LINE,
  })
  y -= 30

  // Médico
  text("Profesional", { size: 9, font: bold, color: MUTED })
  y -= 16
  text(data.doctorName, { size: 13, font: bold })
  y -= 16
  if (data.doctorSpecialty) {
    text(data.doctorSpecialty, { size: 11, color: MUTED })
    y -= 15
  }
  if (data.doctorLicense) {
    text(`Nº de colegiado: ${data.doctorLicense}`, { size: 10, color: MUTED })
    y -= 15
  }
  y -= 14

  // Paciente
  text("Paciente", { size: 9, font: bold, color: MUTED })
  y -= 16
  text(data.patientName, { size: 13, font: bold })
  y -= 16
  const fecha = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(data.issuedAt)
  text(`Emitida: ${fecha}`, { size: 10, color: MUTED })
  y -= 30

  page.drawLine({
    start: { x: marginX, y },
    end: { x: width - marginX, y },
    thickness: 1,
    color: LINE,
  })
  y -= 30

  // Prescripción
  text("Medicamento", { size: 9, font: bold, color: MUTED })
  y -= 16
  text(data.medication, { size: 14, font: bold })
  y -= 24

  text("Posología", { size: 9, font: bold, color: MUTED })
  y -= 16
  for (const line of wrap(data.dosage, 80)) {
    text(line, { size: 12 })
    y -= 16
  }
  y -= 8

  if (data.instructions) {
    text("Instrucciones", { size: 9, font: bold, color: MUTED })
    y -= 16
    for (const line of wrap(data.instructions, 80)) {
      text(line, { size: 11 })
      y -= 15
    }
  }

  // Pie
  page.drawText("Documento generado electrónicamente por DoctorLife.", {
    x: marginX,
    y: 56,
    size: 9,
    font,
    color: MUTED,
  })

  return doc.save()
}

/** Envuelve texto por número aproximado de caracteres por línea. */
function wrap(input: string, max: number): string[] {
  const words = input.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const w of words) {
    if ((current + " " + w).trim().length > max) {
      if (current) lines.push(current.trim())
      current = w
    } else {
      current = (current + " " + w).trim()
    }
  }
  if (current) lines.push(current.trim())
  return lines.length ? lines : [input]
}
