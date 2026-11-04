"use client";

import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { gsap, ScrollTrigger, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";
import { FrameSequence, PLATE_FRAMES } from "@/lib/frameSequence";
import { SCRUB } from "@/lib/motion";

const parts = [
  { title: "Proteína", line: "Frango grelhado, suculento e bem temperado." },
  { title: "Energia", line: "Arroz soltinho e batata-doce assada." },
  { title: "Leguminosas", line: "O feijão de todo dia, do jeito brasileiro." },
  { title: "Cor e frescor", line: "Legumes, folhas, tomate e abacate." },
];

/**
 * Interlúdio entre a filosofia e os serviços: o prato gira 360° conforme a rolagem.
 * A seção fica fixa (pin) e o progresso vira o quadro exibido; cada quarto da volta
 * destaca um grupo do prato. Os quadros só começam a baixar quando a seção se aproxima.
 * Com movimento reduzido: foto estática e todos os grupos visíveis.
 */
export function PlateSection() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add({ desktop: "(min-width: 1024px)", motion: MOTION_OK }, (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      const q = gsap.utils.selector(root);
      const canvas = canvasRef.current!;
      const items = q("[data-part]");
      const ring = root.current!.querySelector<SVGCircleElement>("[data-ring]");

      let seq: FrameSequence | null = null;
      let ro: ResizeObserver | null = null;
      let progress = 0;
      let active = -1;

      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        items.forEach((el, n) => el.toggleAttribute("data-active", n === i));
      };
      setActive(0);
      root.current!.setAttribute("data-animated", "");

      // Baixa os quadros só quando a seção está a ~2 telas de distância.
      // Sem `once`: se a página recarregar já depois da seção, `once` se mata dentro do
      // próprio refresh inicial e o ScrollTrigger quebra. O guard abaixo faz o mesmo papel.
      const loader = ScrollTrigger.create({
        trigger: root.current,
        start: () => `top bottom+=${window.innerHeight * 2}`,
        end: "max",
        onToggle: (self) => {
          if (seq || !self.isActive) return;
          seq = new FrameSequence(canvas, PLATE_FRAMES);
          seq.onFirstFrame = () => gsap.to(canvas, { opacity: 1, duration: 0.4 });
          seq.setProgress(progress);
          ro = new ResizeObserver(() => seq?.resize());
          ro.observe(canvas);
        },
      });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (desktop ? 2.6 : 2)}`,
        pin: true,
        scrub: SCRUB,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress = self.progress;
          seq?.setProgress(progress);
          if (ring) ring.style.strokeDashoffset = String(1 - progress);
          setActive(Math.min(parts.length - 1, Math.floor(progress * parts.length)));
        },
      });

      return () => {
        loader.kill();
        st.kill();
        ro?.disconnect();
        seq?.dispose();
        root.current?.removeAttribute("data-animated");
        items.forEach((el) => el.removeAttribute("data-active"));
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="plate-title"
      className="group/plate relative isolate overflow-hidden bg-[#ebe4da]"
    >
      <div className="mx-auto flex h-[100svh] min-h-[600px] max-w-[1440px] flex-col justify-center gap-y-8 px-[var(--gutter)] lg:grid lg:items-center pt-[calc(var(--header-h)+0.5rem)] pb-24 lg:grid-cols-12 lg:grid-rows-1 lg:gap-x-6 lg:pt-[var(--header-h)] lg:pb-0">
        {/* ── Prato ── */}
        <div className="relative row-start-1 mx-auto aspect-square w-[min(84vw,44svh)] lg:col-span-7 lg:col-start-6 lg:w-[min(46vw,78svh)]">
          {/* Anel de progresso: acompanha a volta do prato */}
          <svg aria-hidden viewBox="0 0 100 100" className="absolute -inset-[3%] -rotate-90 text-forest">
            <circle cx="50" cy="50" r="49.5" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.25" />
            <circle
              data-ring
              cx="50"
              cy="50"
              r="49.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              className="hidden group-data-animated/plate:block"
            />
          </svg>

          {/* Borda do quadro dissolvida no fundo da seção */}
          <div className="absolute inset-0 [mask-image:radial-gradient(circle_closest-side,#000_86%,transparent_100%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/prato-poster.jpg"
              alt="Prato de cerâmica com frango grelhado, arroz, feijão preto, batata-doce, brócolis, tomate-cereja, abacate, cenoura, abobrinha e folhas"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0" />
          </div>
        </div>

        {/* ── Texto ── */}
        <div className="row-start-2 self-start lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center">
          <p className="eyebrow mb-3 flex items-center gap-3 text-sage-deep lg:mb-6" data-fade>
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            Um prato de verdade
          </p>
          <SplitText
            id="plate-title"
            text="Prazer e equilíbrio *no mesmo prato.*"
            className="display text-[clamp(2rem,8.4vw,2.9rem)] text-forest-deep lg:text-[clamp(3rem,4.4vw,4.9rem)]"
          />
          <p className="lede mt-4 hidden max-w-[28rem] text-ink-soft lg:mt-6 lg:block" data-fade>
            Sem proibições: comida de verdade, colorida e saborosa, montada para nutrir e para dar vontade de comer.
          </p>

          <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 lg:mt-10 lg:grid-cols-1 lg:gap-y-0">
            {parts.map((p, i) => (
              <li
                key={p.title}
                data-part
                className="relative transition-opacity duration-500 group-data-animated/plate:opacity-35 data-active:opacity-100! lg:py-4"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-forest/15 lg:block" />
                <div className="flex items-baseline gap-3 lg:gap-5">
                  <span className="serif-italic hidden w-6 shrink-0 text-sage-deep lg:inline">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-[1.15rem] leading-tight text-forest-deep lg:text-[1.6rem]">{p.title}</h3>
                    <p className="mt-1 text-[0.85rem] leading-snug text-ink-soft lg:text-[0.95rem]">{p.line}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
