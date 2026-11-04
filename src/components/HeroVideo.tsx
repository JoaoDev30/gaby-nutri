"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const RM = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/**
 * Vídeo do hero (Higgsfield). Para trocar, substitua os arquivos em /public/video
 * e os posters em /public/media mantendo os nomes — ou altere as constantes abaixo.
 */
const VIDEO = {
  desktop: "/video/hero-1080.mp4",
  mobile: "/video/hero-720.mp4",
  /** 1º quadro do vídeo — mostrado enquanto carrega (sem salto visual). */
  poster: "/media/hero-poster.jpg",
  /** Quadro final, composto — usado para movimento reduzido ou falha de reprodução. */
  still: "/media/prato-composto.jpg",
};

export function HeroVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"loading" | "playing" | "paused" | "fallback">("loading");
  const reducedMotion = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion) return;
    const onPlaying = () => setState("playing");
    const onError = () => setState("fallback");
    v.addEventListener("playing", onPlaying);
    v.addEventListener("error", onError);
    v.play().catch(() => setState("fallback"));

    // Pausa quando fora da tela para poupar bateria/CPU.
    const io = new IntersectionObserver(([e]) => {
      if (!v || v.dataset.userPaused) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("error", onError);
      io.disconnect();
    };
  }, [reducedMotion]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.userPaused;
      v.play().then(() => setState("playing")).catch(() => {});
    } else {
      v.dataset.userPaused = "1";
      v.pause();
      setState("paused");
    }
  };

  const fallback = reducedMotion || state === "fallback";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={fallback ? VIDEO.still : VIDEO.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_50%] lg:object-[72%_50%]"
      />
      {!fallback && (
        <video
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover object-[68%_50%] transition-opacity duration-700 lg:object-[72%_50%] ${
            state === "loading" ? "opacity-0" : "opacity-100"
          }`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={VIDEO.poster}
          aria-hidden
          tabIndex={-1}
        >
          <source src={VIDEO.mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={VIDEO.desktop} type="video/mp4" />
        </video>
      )}

      {!fallback && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-[var(--gutter)] bottom-14 z-20 inline-flex items-center lg:bottom-6 gap-2 rounded-full bg-cream/70 px-3.5 py-2 text-xs font-semibold text-forest-deep backdrop-blur transition hover:bg-cream lg:inline-flex"
          aria-label={state === "paused" ? "Reproduzir animação do topo" : "Pausar animação do topo"}
        >
          {state === "paused" ? (
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>
          )}
          {state === "paused" ? "Reproduzir" : "Pausar"}
        </button>
      )}
    </div>
  );
}
