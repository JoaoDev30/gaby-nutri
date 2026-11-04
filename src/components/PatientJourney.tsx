"use client";

import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { WhatsAppCTA } from "./ui/CTAButton";
import { CitrusSlice } from "./ui/Botanical";
import { gsap, MOTION_OK, DESKTOP, useIsoLayoutEffect } from "@/lib/gsap";
import { EASE, SCRUB } from "@/lib/motion";

/** Etapas do atendimento online — sem duração, frequência ou detalhes operacionais. */
const steps = [
  { n: "01", title: "Entre em contato", text: "Toque em agendar e envie uma mensagem pelo WhatsApp." },
  { n: "02", title: "Converse sobre seu agendamento", text: "Tire suas dúvidas e combine o melhor horário para você." },
  { n: "03", title: "Faça sua consulta online", text: "Um momento para conhecer sua história, sua rotina e seus objetivos." },
  { n: "04", title: "Inicie seu acompanhamento personalizado", text: "Com um plano feito para você, começa a construção de novos hábitos." },
];

export function PatientJourney() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    const build = (axis: "x" | "y") => {
      const q = gsap.utils.selector(root);
      const list = q("[data-steps]")[0];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: axis === "x" ? "top 70%" : "top 75%", end: axis === "x" ? "bottom 45%" : "bottom 60%", scrub: SCRUB },
      });
      tl.fromTo(q("[data-line]"), axis === "x" ? { scaleX: 0 } : { scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: EASE.scroll, duration: 4 }, 0);
      q("[data-step]").forEach((step, i) => {
        tl.to(step.querySelector("[data-node]"), { backgroundColor: "#f7f6f0", scale: 1, duration: 0.3 }, i * 1.1)
          .fromTo(step.querySelector("[data-node-ring]"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, i * 1.1)
          .fromTo(step.querySelectorAll("[data-step-text]"), { opacity: 0.15, y: 14 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, i * 1.1);
      });
    };

    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => build("x"));
    mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => build("y"));
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="como-funciona"
      aria-labelledby="journey-title"
      className="on-dark grain relative isolate overflow-hidden bg-forest py-24 text-cream lg:py-36"
    >
      <CitrusSlice className="pointer-events-none absolute -top-16 -right-16 size-72 text-sage/25 lg:size-[26rem]" strokeWidth={0.8} scroll />

      <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <p className="eyebrow col-span-12 flex items-center gap-3 text-sage" data-fade>
            <span className="tabular-nums">05</span>
            <span aria-hidden className="h-px w-8 bg-sage/60" />
            Como funciona
          </p>
          <SplitText
            id="journey-title"
            text="Seu primeiro passo pode ser *mais simples* do que imagina."
            className="display col-span-12 text-[clamp(2.4rem,5.2vw,5rem)] lg:col-span-9"
          />
        </div>

        <ol data-steps className="relative mt-16 grid gap-12 pl-10 lg:mt-24 lg:grid-cols-4 lg:gap-8 lg:pt-12 lg:pl-0">
          {/* Trilho + linha que evolui com o scroll */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[0.55rem] w-px bg-cream/15 lg:top-[0.55rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
          <span aria-hidden data-line className="absolute top-2 bottom-2 left-[0.55rem] w-px origin-top bg-sage lg:top-[0.55rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left" />

          {steps.map((s) => (
            <li key={s.n} data-step className="relative">
              <span aria-hidden className="absolute top-1 -left-10 flex size-[1.15rem] items-center justify-center lg:-top-12 lg:left-0">
                <span data-node-ring className="absolute inset-[-6px] rounded-full ring-1 ring-sage/60" />
                <span data-node className="size-[0.55rem] rounded-full bg-sage" />
              </span>
              <p data-step-text className="font-serif text-sm tracking-[0.1em] text-sage tabular-nums">Etapa {s.n}</p>
              <h3 data-step-text className="display mt-3 text-[clamp(1.6rem,2.2vw,2.15rem)] leading-[1.08]">{s.title}</h3>
              <p data-step-text className="mt-3 max-w-[22rem] leading-relaxed text-cream/75">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/15 pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-24" data-fade>
          <p className="serif-italic max-w-[28rem] text-xl text-cream/85">Basta uma mensagem para começar.</p>
          <WhatsAppCTA placement="journey" variant="light">Começar pelo WhatsApp</WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}
