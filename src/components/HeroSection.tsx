"use client";

import { useRef } from "react";
import { HeroVideo } from "./HeroVideo";
import { SplitText } from "./ui/SplitText";
import { WhatsAppCTA } from "./ui/CTAButton";
import { Sprig } from "./ui/Botanical";
import { gsap, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.to(q("[data-hero='media']"), { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
        .from(q("[data-hero='media']"), { scale: 1.06, duration: 2.4, ease: "power2.out" }, 0)
        .to(q("[data-hero='eyebrow']"), { opacity: 1, duration: 0.8 }, 0.2)
        .from(q("[data-hero='eyebrow']"), { y: 12, duration: 0.8 }, 0.2)
        .to(q("h1 .split-word > span"), { y: 0, duration: 1.3, stagger: 0.07 }, 0.3)
        .to(q("[data-hero='copy']"), { opacity: 1, duration: 1 }, 0.85)
        .from(q("[data-hero='copy']"), { y: 16, duration: 1, stagger: 0.1 }, 0.85)
        .to(q("[data-hero='aside']"), { opacity: 1, duration: 1.2 }, 1.2)
        .to(q(".hero-sprig path"), { strokeDashoffset: 0, duration: 2.2, stagger: 0.12, ease: "power2.inOut" }, 0.9);

      // Movimento sutil da ilustração e saída suave do texto ao rolar (continuidade com a próxima seção).
      gsap.to(q(".hero-sprig"), { rotate: 4, y: -10, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" });
      gsap.to(q("[data-hero-content]"), {
        yPercent: -12,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-hero='media']"), {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-cream lg:block lg:h-[100svh] lg:min-h-[680px] lg:max-h-[1080px]"
    >
      {/* Mídia: faixa superior no mobile, tela cheia (assunto à direita) no desktop */}
      <div className="relative h-[44svh] min-h-[280px] w-full shrink-0 lg:absolute lg:inset-0 lg:h-full">
        <div data-hero="media" className="absolute inset-0">
          <HeroVideo />
        </div>
        {/* Integração com o fundo creme e legibilidade do texto/navegação */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream via-cream/60 to-transparent lg:h-32 lg:from-cream/80" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-cream via-cream/70 to-transparent lg:h-1/4" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-cream via-cream/75 to-transparent lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-[var(--gutter)] lg:h-full lg:justify-center">
        <div data-hero-content className="-mt-10 max-w-[38rem] lg:mt-0 lg:max-w-[min(44vw,40rem)] lg:pt-[var(--header-h)]">
          <p data-hero="eyebrow" className="eyebrow mb-5 flex items-center gap-3 text-sage-deep lg:mb-7">
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            Nutrição para viver melhor, do seu jeito
          </p>

          <SplitText
            as="h1"
            id="hero-title"
            auto={false}
            text="Comer bem é *viver melhor.*"
            className="display text-[clamp(2.75rem,11.5vw,4rem)] text-forest-deep lg:text-[clamp(4.25rem,6.6vw,7.25rem)]"
          />

          <p data-hero="copy" className="lede mt-5 max-w-[30rem] text-ink-soft lg:mt-8">
            Descubra uma nutrição que respeita sua rotina, valoriza suas escolhas e acompanha você em cada conquista.
          </p>

          <div data-hero="copy" className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-10">
            <WhatsAppCTA placement="hero_primary" className="w-full sm:w-auto">
              Agendar minha consulta
            </WhatsAppCTA>
            <a
              href="#atendimento"
              onClick={() => track("cta_secondary_click", { placement: "hero_secondary" })}
              className="group inline-flex h-12 items-center justify-center gap-2 text-[0.95rem] font-semibold text-forest sm:justify-start"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
                Conheça meu atendimento
              </span>
              <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M8 3v10M4 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <p data-hero="copy" className="mt-4 text-xs text-ink-soft/80 sm:mt-5">
            Agendamento rápido pelo WhatsApp · {siteConfig.whatsapp.display}
          </p>
        </div>
      </div>

      {/* Ilustração botânica pontual */}
      <Sprig className="hero-sprig pointer-events-none absolute bottom-[8%] left-[44%] hidden h-40 w-auto text-sage-deep/45 lg:block xl:left-[41%]" />

      {/* Assinatura vertical + indicador de scroll */}
      <div data-hero="aside" className="pointer-events-none absolute bottom-8 left-[var(--gutter)] z-10 hidden items-center gap-4 lg:flex">
        <span className="relative block h-12 w-px overflow-hidden bg-forest/15" aria-hidden>
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-forest motion-reduce:animate-none" />
        </span>
        <span className="eyebrow text-[0.65rem] text-ink-soft">Role para descobrir</span>
      </div>
      <p data-hero="aside" className="serif-italic pointer-events-none absolute top-1/2 right-[calc(var(--gutter)-0.5rem)] z-10 hidden origin-right -translate-y-1/2 translate-x-1/2 -rotate-90 text-sm whitespace-nowrap text-forest/60 xl:block">
        {siteConfig.tagline}
      </p>
    </section>
  );
}
