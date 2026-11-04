"use client";

import { gsap, ScrollTrigger, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";
import { DUR, EASE, START, STAGGER } from "@/lib/motion";

/**
 * Animações genéricas guiadas por data-attributes:
 *  - [data-split]      título com reveal palavra a palavra
 *  - [data-fade]       parágrafos/elementos de apoio
 *  - [data-clip]       fotografias com abertura editorial (+ zoom interno)
 *  - [data-parallax]   deslocamento sutil (valor = intensidade)
 *  - .draw[data-draw]  ilustrações botânicas desenhadas pelo scroll
 * Seções com coreografia própria usam data-split="manual".
 */
export function MotionLayer() {
  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-split=""]').forEach((el) => {
        gsap.to(el.querySelectorAll(".split-word > span"), {
          yPercent: 0,
          y: 0,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger: STAGGER.words,
          scrollTrigger: { trigger: el, start: START, once: true },
        });
      });

      ScrollTrigger.batch("[data-fade]", {
        start: START,
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.items, ease: EASE.soft }),
      });

      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START, once: true } });
        tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: DUR.slow, ease: EASE.inOut });
        if (img) tl.from(img, { scale: 1.15, duration: DUR.slow + 0.4, ease: EASE.out }, 0.1);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "0.1");
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: EASE.scroll,
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<SVGElement>(".draw[data-draw]").forEach((svg) => {
        gsap.to(svg.querySelectorAll("path, circle, line"), {
          strokeDashoffset: 0,
          ease: EASE.scroll,
          stagger: 0.08,
          scrollTrigger: { trigger: svg, start: "top 92%", end: "bottom 45%", scrub: 1 },
        });
      });
    });

    root.classList.add("motion-ready");
    // Recalcula posições após fontes/imagens carregarem (evita gatilhos deslocados).
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
