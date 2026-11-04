"use client";

import { gsap, ScrollTrigger, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";

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
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      ScrollTrigger.batch("[data-fade]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "power2.out" }),
      });

      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.from(img, { scale: 1.18, duration: 1.8, ease: "expo.out" }, 0.1);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "0.1");
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<SVGElement>(".draw[data-draw]").forEach((svg) => {
        gsap.to(svg.querySelectorAll("path, circle, line"), {
          strokeDashoffset: 0,
          ease: "none",
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
