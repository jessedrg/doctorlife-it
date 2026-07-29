"use client";

import { useEffect, useRef } from "react";

/**
 * Vertical parallax. Wraps an element and nudges it on scroll based
 * on its position relative to the viewport center.
 * <Parallax speed={40}>...</Parallax>
 */
export function Parallax({
  speed = 30,
  children,
  className,
}: {
  speed?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const off = (vh / 2 - center) / vh;
      el.style.transform = `translateY(${(off * speed).toFixed(1)}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
