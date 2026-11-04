"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SplitText } from "./ui/SplitText";
import { gsap, ScrollTrigger, MOTION_OK, DESKTOP, useIsoLayoutEffect } from "@/lib/gsap";
import { EASE } from "@/lib/motion";

/**
 * As imagens seguem a sequência do vídeo do hero — dos ingredientes separados ao prato composto —
 * como metáfora do acompanhamento: conhecer, montar, ajustar, sustentar.
 */
const services = [
  {
    n: "01",
    title: "Avaliação nutricional completa",
    lead: "Entender você antes de montar o plano.",
    body: "Uma conversa detalhada sobre sua rotina, seus hábitos, sua saúde e seus objetivos é o ponto de partida para decisões mais precisas.",
    img: { src: "/media/mesa-variada.jpg", alt: "Ingredientes variados dispostos sobre a mesa" },
  },
  {
    n: "02",
    title: "Plano alimentar individualizado",
    lead: "Uma alimentação construída para sua realidade.",
    body: "Considera sua rotina, suas preferências, seus horários e seus objetivos — sem cardápios genéricos.",
    img: { src: "/media/bowl-detalhe.jpg", alt: "Tigela de iogurte com granola cercada de frutas" },
  },
  {
    n: "03",
    title: "Estratégias personalizadas",
    lead: "Orientações alinhadas aos seus objetivos e à sua evolução.",
    body: "As estratégias são ajustadas conforme você avança, respeitando o seu ritmo.",
    img: { src: "/media/ingredientes-em-movimento.jpg", alt: "Frutas, ovos e oleaginosas em movimento acima de uma tigela" },
  },
  {
    n: "04",
    title: "Orientação e acompanhamento",
    lead: "Você não precisa percorrer esse caminho sem apoio.",
    body: "Orientação profissional ao longo do processo, para ajustar o plano e sustentar a constância.",
    img: { src: "/media/prato-composto-vertical.jpg", alt: "Frutas e ingredientes compondo uma esfera harmoniosa sobre a tigela" },
  },
];

export function ServicesSection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(DESKTOP, () => {
      const q = gsap.utils.selector(root);
      const items = q("[data-service]");
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    });
    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-progress]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: EASE.scroll,
          scrollTrigger: { trigger: q("[data-list]")[0], start: "top 55%", end: "bottom 55%", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="atendimento" aria-labelledby="services-title" className="relative bg-cream py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <p className="eyebrow col-span-12 flex items-center gap-3 text-sage-deep" data-fade>
            <span className="tabular-nums">03</span>
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            Atendimento
          </p>
          <SplitText
            id="services-title"
            text="Um acompanhamento *pensado para você.*"
            className="display col-span-12 text-[clamp(2.4rem,5.6vw,5.25rem)] text-forest-deep lg:col-span-8"
          />
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-6 lg:mt-24">
          {/* Imagem sticky (desktop) com troca a cada etapa */}
          <div className="col-span-5 hidden lg:block">
            <div className="sticky top-[14vh] h-[72vh] max-h-[760px]">
              <div className="relative h-full overflow-hidden rounded-t-[999px] rounded-b-[2px] bg-mist" data-clip>
                {services.map((s, i) => (
                  <Image
                    key={s.n}
                    src={s.img.src}
                    alt={i === active ? s.img.alt : ""}
                    aria-hidden={i !== active}
                    fill
                    sizes="38vw"
                    className={`object-cover transition-[opacity,transform,clip-path] duration-[1100ms] ease-[var(--ease-soft)] motion-reduce:transition-none ${
                      i === active
                        ? "scale-100 opacity-100 [clip-path:inset(0_0_0_0)]"
                        : i < active
                          ? "scale-105 opacity-0 [clip-path:inset(0_0_0_0)]"
                          : "scale-110 opacity-100 [clip-path:inset(100%_0_0_0)]"
                    }`}
                    style={{ zIndex: i === active ? 2 : i < active ? 1 : 3 }}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-soft" aria-hidden>
                <span className="font-semibold tracking-[0.2em] tabular-nums">
                  {services[active].n} <span className="text-ink-soft/50">/ 04</span>
                </span>
                <span className="serif-italic text-sm">{services[active].lead}</span>
              </div>
            </div>
          </div>

          {/* Lista de etapas */}
          <div className="relative col-span-12 lg:col-span-6 lg:col-start-7" data-list>
            <span aria-hidden className="absolute top-0 bottom-0 left-[0.6rem] w-px bg-forest/15 lg:left-0" />
            <span aria-hidden data-progress className="absolute top-0 bottom-0 left-[0.6rem] hidden w-px origin-top bg-forest lg:left-0 lg:block" />

            {/* Mobile: uma única imagem para manter a seção enxuta */}
            <div className="relative mb-10 ml-8 aspect-[16/11] overflow-hidden rounded-t-[999px] lg:hidden" data-clip>
              <Image src="/media/prato-composto-vertical.jpg" alt="Frutas e ingredientes compondo uma esfera sobre uma tigela" fill sizes="90vw" className="object-cover object-[50%_40%]" />
            </div>

            <ol className="space-y-12 lg:space-y-0">
              {services.map((s, i) => (
                <li
                  key={s.n}
                  data-service
                  className={`relative pl-8 transition-opacity duration-700 lg:flex lg:min-h-[44vh] lg:flex-col lg:justify-center lg:pl-14 ${
                    i === active ? "lg:opacity-100" : "lg:opacity-35"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-1.5 left-[0.6rem] size-2.5 -translate-x-1/2 rounded-full ring-4 ring-cream transition-colors duration-500 lg:top-auto lg:left-0 ${
                      i <= active ? "bg-forest" : "bg-sage"
                    }`}
                  />
                  <p className="font-serif text-[clamp(3rem,5vw,4.5rem)] leading-none text-sage [font-variation-settings:'SOFT'_100,'opsz'_144]" aria-hidden>
                    {s.n}
                  </p>
                  <h3 className="mt-3 text-[0.8rem] font-semibold tracking-[0.16em] text-sage-deep uppercase">{s.title}</h3>
                  <p className="display mt-3 text-[clamp(1.75rem,2.6vw,2.6rem)] leading-[1.08] text-forest-deep">{s.lead}</p>
                  <p className="mt-4 max-w-[30rem] leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
