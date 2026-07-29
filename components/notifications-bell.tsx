"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Bell, Check } from "lucide-react"
import {
  getMyNotifications,
  markAllNotificationsRead,
  type NotificationRow,
} from "@/app/actions/notifications"

const relTime = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" })

function timeAgo(date: Date) {
  const diff = (date.getTime() - Date.now()) / 1000
  const mins = Math.round(diff / 60)
  if (Math.abs(mins) < 60) return relTime.format(mins, "minute")
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 24) return relTime.format(hours, "hour")
  return relTime.format(Math.round(hours / 24), "day")
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationRow[]>([])
  const [unread, setUnread] = useState(0)
  const [, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  const load = () => {
    getMyNotifications()
      .then((rows) => {
        setItems(rows)
        setUnread(rows.filter((r) => !r.read).length)
      })
      .catch(() => {})
  }

  // Carga inicial y sondeo ligero cada 60s.
  useEffect(() => {
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [])

  // Cerrar al hacer click fuera.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && unread > 0) {
      setUnread(0)
      setItems((prev) => prev.map((p) => ({ ...p, read: true })))
      startTransition(async () => {
        await markAllNotificationsRead()
      })
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notificaciones"
        className="relative flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm"
      >
        <Bell className="size-5" aria-hidden />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex min-w-[16px] items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold leading-none text-paper">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[320px] max-w-[86vw] overflow-hidden rounded-[16px] border border-ink/10 bg-paper shadow-xl">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-[14px] font-medium text-ink">Notificaciones</p>
            {items.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[12px] text-ink-mute">
                <Check className="size-3.5" aria-hidden />
                Al día
              </span>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13.5px] text-ink-soft">
              No tienes notificaciones todavía.
            </p>
          ) : (
            <ul className="max-h-[360px] divide-y divide-ink/[.06] overflow-y-auto">
              {items.map((n) => {
                const content = (
                  <div className="px-4 py-3 transition-colors hover:bg-warm">
                    <p className="text-[13.5px] font-medium text-ink">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">{n.body}</p>}
                    <p className="mt-1 text-[11px] text-ink-mute">{timeAgo(n.createdAt)}</p>
                  </div>
                )
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
