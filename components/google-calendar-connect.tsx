"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { disconnectGoogle, type GoogleConnectionStatus } from "@/app/actions/google-connection"
import { Check, Loader2, Video, CalendarClock } from "lucide-react"

export function GoogleCalendarConnect({ status }: { status: GoogleConnectionStatus }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!status.configured) {
    return (
      <div className="max-w-[560px] rounded-[20px] border border-ink/12 bg-warm p-5">
        <div className="flex items-center gap-3 text-ink">
          <BrandTile src="/brand/google-calendar.svg" alt="Google Calendar" />
          <span className="text-[15.5px] font-medium">Google Calendar</span>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          La sincronización con Google aún no está disponible en la plataforma. El equipo la activará
          en breve; no necesitas hacer nada.
        </p>
      </div>
    )
  }

  const connect = async () => {
    setError(null)
    setLoading(true)
    try {
      await authClient.linkSocial({
        provider: "google",
        callbackURL: "/clinica/cuenta?google=conectado",
      })
      // linkSocial redirige al consentimiento de Google; si vuelve sin redirigir
      // refrescamos el estado por si ya quedó enlazado.
      router.refresh()
    } catch {
      setError("No se pudo iniciar la conexión con Google. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  const disconnect = async () => {
    setError(null)
    setLoading(true)
    try {
      await disconnectGoogle()
      router.refresh()
    } catch {
      setError("No se pudo desconectar Google. Inténtalo de nuevo.")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-[560px] overflow-hidden rounded-[20px] border border-ink/12 bg-warm">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <BrandTile src="/brand/google-calendar.svg" alt="Google Calendar" />
            <BrandTile src="/brand/google-meet.svg" alt="Google Meet" />
          </div>
          <div>
            <p className="text-[15.5px] font-medium text-ink">Google Calendar y Meet</p>
            <p className="text-[12.5px] text-ink-mute">Videollamadas automáticas</p>
          </div>
        </div>
        <StatusPill connected={status.connected} />
      </div>

      <div className="px-5 pb-4">
        <p className="text-[14px] leading-relaxed text-ink-soft">
          {status.connected
            ? "Tu calendario está sincronizado. Tus huecos ocupados se descartan automáticamente y cada cita pagada genera un evento con enlace de Google Meet para ti y el paciente."
            : "Conecta tu cuenta de Google para que tus huecos respeten tus eventos existentes y cada cita genere automáticamente una videollamada de Google Meet con invitación al paciente."}
        </p>

        <ul className="mt-3.5 grid gap-1.5 text-[13.5px] text-ink-soft sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <CalendarClock className="size-4 text-olive" aria-hidden />
            Sincroniza tu agenda
          </li>
          <li className="flex items-center gap-2">
            <Video className="size-4 text-olive" aria-hidden />
            Enlace de Meet por cita
          </li>
        </ul>

        {error ? (
          <p role="alert" className="mt-3 text-[13.5px] text-clay">
            {error}
          </p>
        ) : null}
      </div>

      <div className="border-t border-ink/10 bg-paper/40 px-5 py-3.5">
        {status.connected ? (
          <button
            type="button"
            onClick={disconnect}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[12px] border border-ink/15 px-4 py-2.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-ink/[.04] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Desconectar
          </button>
        ) : (
          <button
            type="button"
            onClick={connect}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[12px] bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Image src="/brand/google-calendar.svg" alt="" width={18} height={18} aria-hidden />
            )}
            Conectar Google Calendar
          </button>
        )}
      </div>
    </div>
  )
}

function StatusPill({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-olive/12 px-3 py-1 text-[12.5px] font-medium text-olive">
        <Check className="size-3.5" aria-hidden />
        Conectado
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[12.5px] font-medium text-clay">
      Sin conectar
    </span>
  )
}

function BrandTile({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-xl border border-ink/10 bg-paper shadow-sm">
      <Image src={src} alt={alt} width={22} height={22} />
    </span>
  )
}
