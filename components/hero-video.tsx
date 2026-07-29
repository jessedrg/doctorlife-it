"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo de fondo con autoplay robusto (incluye trucos para iOS Safari).
 * Reutiliza la estrategia probada de ImmersiveProduct: silenciado,
 * playsInline y reintentos en cada evento de datos / interacción.
 */
export function HeroVideo({
  src,
  className,
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS Safari requiere fijar esto vía JS, no solo por atributos JSX
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      if (!video.paused) return;
      video.muted = true;
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", tryPlay, { passive: true });
    video.addEventListener("canplaythrough", tryPlay, { once: true });
    video.addEventListener("loadeddata", tryPlay, { once: true });
    video.addEventListener("loadedmetadata", tryPlay, { once: true });
    tryPlay();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) tryPlay();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);

    const onTouch = () => tryPlay();
    document.addEventListener("touchstart", onTouch, { once: true, passive: true });
    document.addEventListener("touchend", onTouch, { once: true, passive: true });

    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", tryPlay, { passive: true });

    video.load();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("touchend", onTouch);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", tryPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      preload="metadata"
      x-webkit-airplay="deny"
      aria-hidden="true"
      className={className}
    />
  );
}
