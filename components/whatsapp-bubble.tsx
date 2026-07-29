"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { analytics } from "@/lib/analytics";

const PHONE = "39";

export function WhatsAppBubble() {
  const t = useTranslations("ui.whatsapp");
  const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("defaultMessage"))}`;
  const MESSAGES = t.raw("messages") as string[];
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // appear after 0.8s
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // auto-expand tooltip after 0.5s of being visible
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setExpanded(true), 500);
    return () => clearTimeout(timer);
  }, [visible]);

  // rotate messages every 6s with a fade transition
  useEffect(() => {
    if (!expanded) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 250);
    }, 6000);
    return () => clearInterval(interval);
  }, [expanded]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex items-end gap-3">
      {/* Tooltip bubble */}
      <div
        className={`
          relative mb-1 max-w-[210px] cursor-pointer
          transition-all duration-500 ease-out
          ${expanded
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-3 pointer-events-none"
          }
        `}
        onClick={() => {
          analytics.whatsappClicked("tooltip");
          window.open(WA_URL, "_blank");
        }}
      >
        <div className="relative rounded-2xl rounded-br-sm bg-ink px-4 pt-2.5 pb-3 text-paper shadow-xl">
          {/* Header row: message + close */}
          <div className="flex items-start justify-between gap-2.5">
            <p
              className="text-[14px] font-medium leading-snug text-balance transition-opacity duration-250"
              style={{ opacity: fade ? 1 : 0 }}
            >
              {MESSAGES[msgIndex]}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white/15 text-paper text-[11px] leading-none hover:bg-white/25 transition-colors"
              aria-label={t("close")}
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-[12px] opacity-60">
            {t("responseTime")}
          </p>
          {/* Tail */}
          <span
            className="absolute -right-2 bottom-3 h-0 w-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "7px solid #221d17",
            }}
          />
        </div>
      </div>

      {/* WhatsApp button — no pulse, clean */}
      <button
        onClick={() => {
          if (!expanded) {
            setExpanded(true);
          } else {
            analytics.whatsappClicked("button");
            window.open(WA_URL, "_blank");
          }
        }}
        aria-label={t("ariaLabel")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-7 w-7 fill-white"
          aria-hidden="true"
        >
          <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.3l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.3 30 7.5 27.1 7.5 24 7.5 14.8 15 7.5 24 7.5S40.5 15 40.5 24 33 40 24 40zm10.8-13.4c-.6-.3-3.4-1.7-3.9-1.9-.5-.2-.9-.3-1.2.3-.4.6-1.4 1.9-1.7 2.2-.3.4-.6.4-1.1.1-.6-.3-2.4-.9-4.6-2.8-1.7-1.5-2.8-3.4-3.2-3.9-.3-.6 0-.9.3-1.1l.9-1.1c.2-.3.3-.6.5-.9.2-.3.1-.6 0-.9-.1-.2-1.2-2.9-1.6-3.9-.4-1-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.4.7-.5.5-1.8 1.8-1.8 4.3s1.9 5 2.1 5.4c.3.3 3.7 5.7 9 8 1.3.5 2.3.8 3 1.1 1.3.4 2.4.3 3.3.2 1-.2 3.1-1.3 3.5-2.5.4-1.2.4-2.2.3-2.5-.1-.3-.5-.4-1-.7z" />
        </svg>
      </button>
    </div>
  );
}
