"use client";

import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { WhatsAppCTA } from "./ui/CTAButton";
import { gsap, ScrollTrigger, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";
import { FrameSequence, HERO_FRAMES } from "@/lib/frameSequence";
import { DUR, EASE, SCRUB, STAGGER } from "@/lib/motion";
import { track } from "@/lib/analytics";

/**
 * HERO — vídeo controlado pelo scroll.
 * A seção fica fixa (pin) enquanto o progresso da rolagem vira o quadro exibido (0 → 100%).
 * Texto e imagem compartilham a mesma timeline; no final o texto sobe e some, o vídeo
 * termina no último quadro e a seção seguinte entra pela rolagem natural.
 */

const chapters = ["Comer bem", "Além das restrições", "Seu equilíbrio", "Resultados reais"];

/** Fração da timeline ocupada pelos quadros; o restante é a transição de saída. */
const VIDEO_END = 0.86;

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useIsoLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(root);

    mm.add(
      { desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)", motion: MOTION_OK },
      (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; mobile: boolean; motion: boolean };
        if (!motion) return;
        const q = gsap.utils.selector(root);
        const canvas = canvasRef.current!;
        const seq = new FrameSequence(canvas, desktop ? HERO_FRAMES.desktop : HERO_FRAMES.mobile);
        seq.onFirstFrame = () => gsap.to(canvas, { opacity: 1, duration: 0.4 });
        seq.setProgress(0);
        const ro = new ResizeObserver(() => seq.resize());
        ro.observe(canvas);

        // Normaliza o estado inicial em yPercent (o CSS usa translateY(110%), que o GSAP leria como px).
        gsap.set(q("[data-moment] .split-word > span"), { y: 0, yPercent: 110 });

        /* ── Entrada no carregamento (independente do scroll): reveal palavra por palavra ── */
        const intro = gsap.timeline({ delay: 0.15, defaults: { ease: EASE.out } });
        intro
          .to(q("[data-hero='media']"), { opacity: 1, duration: DUR.slow, ease: EASE.soft }, 0)
          .to(q("[data-hero='eyebrow']"), { opacity: 1, duration: DUR.base }, 0.2)
          .to(q("[data-moment='1'] .split-word > span"), { yPercent: 0, duration: DUR.reveal + 0.2, stagger: STAGGER.words }, 0.3)
          .to(q("[data-hero='copy']"), { opacity: 1, duration: DUR.base, stagger: STAGGER.items }, 0.8)
          .fromTo(q("[data-hero='copy']"), { y: 14 }, { y: 0, duration: DUR.base, stagger: STAGGER.items }, 0.8)
          .to(q("[data-hero='aside']"), { opacity: 1, duration: DUR.base }, 1.1);

        /* ── Timeline amarrada ao scroll ── */
        const frame = { p: 0 };
        const tl = gsap.timeline({
          defaults: { ease: EASE.scroll },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            // ~3 telas no desktop, ~2,4 no mobile: o suficiente para ler, sem prender o visitante.
            end: () => `+=${window.innerHeight * (desktop ? 3 : 2.4)}`,
            pin: true,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Quadros: progresso 0→1 mapeado para o 1º → último quadro, até o fim do hero.
        tl.to(frame, { p: 1, duration: 1, ease: "none", onUpdate: () => seq.setProgress(frame.p) }, 0);

        // Indicador de capítulos (linha que se desenha — efeito 07)
        q("[data-chapter-fill]").forEach((el, i) => {
          tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: VIDEO_END / 4 }, (VIDEO_END / 4) * i);
        });
        tl.to(q("[data-hero='cue']"), { opacity: 0, duration: 0.04 }, 0.01);

        // Momentos de texto: sai palavra por palavra para cima, entra palavra por palavra de baixo.
        const out = (n: number, at: number) => {
          tl.fromTo(q(`[data-moment='${n}'] .split-word > span`), { yPercent: 0 }, { yPercent: -110, duration: 0.05, stagger: 0.006, immediateRender: false }, at);
          tl.fromTo(q(`[data-moment='${n}'] [data-moment-fade]`), { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.04, immediateRender: false }, at);
          tl.set(q(`[data-moment='${n}']`), { pointerEvents: "none" }, at + 0.05);
        };
        const inn = (n: number, at: number) => {
          tl.set(q(`[data-moment='${n}']`), { opacity: 1, pointerEvents: "auto" }, at);
          tl.fromTo(
            q(`[data-moment='${n}'] .split-word > span`),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.07, stagger: 0.008, ease: "power2.out", immediateRender: false },
            at,
          );
          tl.fromTo(q(`[data-moment='${n}'] [data-moment-fade]`), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05, immediateRender: false }, at + 0.04);
        };
        const V = VIDEO_END;
        out(1, V * 0.2);
        inn(2, V * 0.27);
        out(2, V * 0.46);
        inn(3, V * 0.52);
        out(3, V * 0.7);
        inn(4, V * 0.76);


        /* ── Saída (como no site do Diego): sem máscara. O vídeo segue até o último quadro,
              o texto sobe e some, e a seção seguinte entra pela rolagem natural ao soltar o pin. ── */
        const T = 1 - V;
        tl.to(q("[data-moment='4'], [data-hero='copy']"), { opacity: 0, y: -70, duration: T * 0.8, ease: "power2.in" }, V);
        tl.to(q("[data-hero='eyebrow'], [data-hero='chapters']"), { opacity: 0, duration: T * 0.6 }, V);

        return () => {
          ro.disconnect();
          seq.dispose();
          intro.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="inicio" aria-labelledby="hero-title" className="relative isolate bg-cream">
      <div className="relative h-[100svh] min-h-[560px] overflow-hidden lg:min-h-[640px]">
        {/* ── Mídia: faixa superior no mobile, tela cheia no desktop ── */}
        <div
          data-hero="media"
          className="absolute inset-x-0 top-0 h-[47svh] lg:inset-0 lg:h-full"
        >
          {/* Poster = 1º quadro (LCP imediato). Com movimento reduzido: composição final, estática. */}
          <picture data-still="first" className="absolute inset-0">
            <source media="(min-width: 1024px)" srcSet="/media/hero-poster.jpg" />
            <img
              src="/media/hero-poster-mobile.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_50%] lg:object-[72%_50%]"
            />
          </picture>
          <picture data-still="final" className="absolute inset-0">
            <source media="(min-width: 1024px)" srcSet="/media/prato-composto.jpg" />
            <img
              src="/media/hero-final-mobile.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[50%_50%] lg:object-[72%_50%]"
            />
          </picture>
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0" />

          {/* Integração com o creme + legibilidade */}
          <div data-hero="fade" aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream via-cream/50 to-transparent" />
          <div data-hero="fade" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cream via-cream/70 to-transparent lg:h-1/5" />
          <div
            data-hero="veil"
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[66%] bg-gradient-to-r from-cream from-30% via-cream/85 to-transparent lg:block"
          />
        </div>

        {/* ── Conteúdo ── */}
        <div className="absolute inset-x-0 top-[42svh] bottom-0 z-10 mx-auto flex w-full max-w-[1440px] flex-col px-[var(--gutter)] lg:inset-y-0 lg:top-0 lg:justify-center lg:pt-[var(--header-h)]">
          <div className="w-full max-w-[36rem] lg:max-w-[min(44vw,40rem)]">
            <p data-hero="eyebrow" className="eyebrow mb-4 flex items-center gap-3 text-sage-deep lg:mb-7">
              <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
              Nutrição para viver melhor, do seu jeito
            </p>

            {/* Momentos empilhados na mesma célula: só um visível por vez */}
            <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              <div data-moment="1">
                <SplitText
                  as="h1"
                  id="hero-title"
                  auto={false}
                  text="Comer bem é *viver melhor.*"
                  className="display text-[clamp(2.5rem,10.5vw,3.6rem)] text-forest-deep lg:text-[clamp(4rem,6.4vw,7rem)]"
                />
                <p data-hero="copy" data-moment-fade className="lede mt-4 max-w-[30rem] text-ink-soft lg:mt-7">
                  Uma nutrição que respeita sua rotina, suas escolhas e seus objetivos.
                </p>
              </div>

              <div data-moment="2" aria-hidden>
                <SplitText
                  as="p"
                  auto={false}
                  text="Alimentação saudável vai muito além das *restrições.*"
                  className="display text-[clamp(2.2rem,9vw,3.2rem)] text-forest-deep lg:text-[clamp(3.2rem,4.7vw,5.25rem)]"
                />
                <p data-moment-fade className="lede mt-4 max-w-[28rem] text-ink-soft lg:mt-7">
                  Variedade, prazer e equilíbrio cabem no mesmo prato.
                </p>
              </div>

              <div data-moment="3" aria-hidden>
                <SplitText
                  as="p"
                  auto={false}
                  text="Seu corpo. Sua rotina. *Seu equilíbrio.*"
                  className="display text-[clamp(2.2rem,9vw,3.2rem)] text-forest-deep lg:text-[clamp(3.2rem,4.7vw,5.25rem)]"
                />
              </div>

              <div data-moment="4" aria-hidden>
                <SplitText
                  as="p"
                  auto={false}
                  text="Saúde, equilíbrio e *resultados reais.*"
                  className="display text-[clamp(2.2rem,9vw,3.2rem)] text-forest-deep lg:text-[clamp(3.2rem,4.7vw,5.25rem)]"
                />
                <p data-moment-fade className="mt-5 flex items-center gap-3 text-sm font-semibold tracking-[0.04em] text-forest lg:mt-8">
                  <span aria-hidden className="h-px w-8 bg-forest/40" />
                  Gabrielly Fernandes <span className="text-sage-deep">|</span> Nutricionista
                </p>
              </div>
            </div>

            {/* CTA persistente durante toda a experiência */}
            <div data-hero="copy" className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 lg:mt-10">
              <WhatsAppCTA placement="hero_primary" className="w-full sm:w-auto">
                Agendar minha consulta
              </WhatsAppCTA>
              <a
                href="#atendimento"
                onClick={() => track("cta_secondary_click", { placement: "hero_secondary" })}
                className="group inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap text-[0.95rem] font-semibold text-forest sm:justify-start [@media(max-height:700px)_and_(max-width:1023px)]:hidden"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
                  Conheça meu atendimento
                </span>
                <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Capítulos: linha que se desenha com o progresso ── */}
        <div
          data-hero="chapters"
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10 mx-auto hidden max-w-[1440px] px-[var(--gutter)] lg:block"
        >
          <div className="grid max-w-[min(44vw,40rem)] grid-cols-4 gap-3" data-hero="aside">
            {chapters.map((c, i) => (
              <div key={c}>
                <span className="relative block h-px overflow-hidden bg-forest/15">
                  <span data-chapter-fill className="absolute inset-0 origin-left scale-x-0 bg-forest" />
                </span>
                <span className="mt-2 block text-[0.65rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                  0{i + 1} · {c}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de rolagem (some ao começar) */}
        <div data-hero="cue" aria-hidden className="pointer-events-none absolute right-[var(--gutter)] bottom-6 z-10 hidden items-center gap-3 lg:flex">
          <span data-hero="aside" className="eyebrow text-[0.65rem] text-ink-soft">Role para conduzir a história</span>
          <span className="relative block h-10 w-px overflow-hidden bg-forest/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-forest motion-reduce:animate-none" />
          </span>
        </div>
      </div>
    </section>
  );
}
