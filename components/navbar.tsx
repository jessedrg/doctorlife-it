"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { QuizTrigger } from "./quiz-trigger";
import { BrandLogo } from "./brand-logo";
import { analytics } from "@/lib/analytics";

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const t = useTranslations("ui.navbar");
  const links = [
    { label: t("howItWorks"), href: "/#product" },
    { label: t("plansPricing"), href: "/#planes" },
    { label: t("start"), href: "/#cta" },
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  // Registra la navegación desde el blog hacia la página principal.
  const trackNav = (href: string) => {
    const goesHome = href === "/" || href === "/#top" || href.startsWith("/#");
    if (pathname.startsWith("/blog") && goesHome) {
      analytics.blogToHome(href);
    }
  };

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Detecta el scroll para compactar la barra
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky z-[90] mx-auto w-full max-w-none px-3 transition-all duration-500 ease-out sm:px-4 lg:px-5 ${
        scrolled ? "top-2 mt-2" : "top-4 mt-4"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 rounded-full border pr-[10px] backdrop-blur-xl transition-all duration-500 ease-out ${
          scrolled
            ? "h-[58px] border-ink/15 pl-6 shadow-[0_8px_28px_-10px_rgba(34,29,23,.4)] sm:h-[60px] sm:pl-7"
            : "h-[64px] border-ink/10 pl-6 shadow-[0_12px_40px_-12px_rgba(34,29,23,.28)] sm:h-[68px] sm:pl-7"
        }`}
        style={{ background: scrolled ? "rgba(246,240,230,.92)" : "rgba(246,240,230,.82)" }}
      >
        <a
          href="/#top"
          onClick={(e) => {
            setOpen(false);
            trackNav("/#top");
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center text-ink no-underline transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          aria-label={t("ariaLabel")}
        >
          <BrandLogo markSize={scrolled ? 27 : 30} textSize={scrolled ? 19 : 20} textClassName="text-ink" />
        </a>

        {/* enlaces desktop */}
        <div className="hidden items-center gap-[28px] whitespace-nowrap text-[15px] font-medium md:flex">
          {links.slice(0, 2).map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <a
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`group relative text-ink no-underline transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-75 hover:opacity-100"
                }`}
              >
                {l.label}
                {/* subrayado animado */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-ink transition-all duration-300 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sign-in"
            className="hidden items-center whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium text-ink no-underline opacity-75 transition-opacity duration-300 hover:opacity-100 md:inline-flex"
          >
            {t("signIn")}
          </a>

          <QuizTrigger className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-ink px-[22px] py-[13px] text-[15px] font-medium text-paper transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:inline-flex">
            {t("start")}
            <span className="text-[13px] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
              ↗
            </span>
          </QuizTrigger>

          {/* botón menú móvil */}
          <button
            type="button"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 active:scale-90 md:hidden"
          >
            <span className="relative flex h-[14px] w-[18px] flex-col justify-between">
              <span
                className="h-[2px] w-full rounded bg-paper transition-transform duration-300 ease-out"
                style={open ? { transform: "translateY(6px) rotate(45deg)" } : undefined}
              />
              <span
                className="h-[2px] w-full rounded bg-paper transition-opacity duration-200"
                style={open ? { opacity: 0 } : undefined}
              />
              <span
                className="h-[2px] w-full rounded bg-paper transition-transform duration-300 ease-out"
                style={open ? { transform: "translateY(-6px) rotate(-45deg)" } : undefined}
              />
            </span>
          </button>
        </div>
      </div>

      {/* panel móvil */}
      <div
        className={`absolute inset-x-3 top-full overflow-hidden transition-all duration-300 ease-out sm:inset-x-4 lg:inset-x-5 md:hidden ${
          open ? "mt-3 max-h-[460px] opacity-100" : "pointer-events-none mt-0 max-h-0 opacity-0"
        }`}
      >
        <div
          className="rounded-[28px] border border-ink/10 p-3 shadow-[0_20px_50px_-20px_rgba(34,29,23,.4)] backdrop-blur-xl"
          style={{ background: "rgba(246,240,230,.95)" }}
        >
          <div className="flex flex-col">
            {links.map((l, i) => {
              const active = isActive(pathname, l.href);
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    transition: "opacity .4s ease, transform .4s ease",
                    transitionDelay: open ? `${80 + i * 55}ms` : "0ms",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(8px)",
                  }}
                  className={`flex items-center justify-between rounded-2xl px-5 py-[14px] text-[17px] font-medium text-ink no-underline transition-colors hover:bg-ink/5 ${
                    active ? "bg-ink/5" : ""
                  }`}
                >
                  {l.label}
                  {active && <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />}
                </a>
              );
            })}
          </div>
          <a
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="mt-2 flex w-full items-center justify-center rounded-full border border-ink/15 px-6 py-4 text-[16px] font-medium text-ink no-underline transition-colors hover:bg-ink/5"
          >
            {t("signIn")}
          </a>
          <QuizTrigger className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[16px] font-medium text-paper transition-transform duration-300 active:scale-95">
            {t("start")}
            <span className="text-[13px] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
              ↗
            </span>
          </QuizTrigger>
        </div>
      </div>
    </nav>
  );
}
