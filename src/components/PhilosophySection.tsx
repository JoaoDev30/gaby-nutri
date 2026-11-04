"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { gsap, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";

const concepts = [
  { n: "i.", word: "Individualidade", line: "Seu plano parte da sua história — não de um modelo pronto.", indent: "lg:pl-0" },
  { n: "ii.", word: "Equilíbrio", line: "Espaço para o que nutre e para o que dá prazer.", indent: "lg:pl-[16%]" },
  { n: "iii.", word: "Constância", line: "Pequenas escolhas, repetidas, que cabem na sua semana.", indent: "lg:pl-[6%]" },
  { n: "iv.", word: "Qualidade de vida", line: "Comer bem para viver melhor — dentro e fora do prato.", indent: "lg:pl-[22%]" },
];

/** 03 — O cuidado é individual: índice editorial com palavras-conceito e fotografias intercaladas. */
export function PhilosophySection() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      q("[data-concept]").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 82%", once: true } });
        tl.from(row.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.inOut" })
          .from(row.querySelector("[data-word]"), { clipPath: "inset(0 100% 0 0)", x: -20, duration: 1.3, ease: "expo.out" }, 0.25)
          .from(row.querySelectorAll("[data-meta]"), { opacity: 0, y: 10, duration: 0.8, stagger: 0.08 }, 0.5);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="philosophy-title" className="relative bg-mist pt-12 pb-24 lg:pt-20 lg:pb-36">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          <p className="eyebrow col-span-12 flex items-center gap-3 text-sage-deep" data-fade>
            <span className="tabular-nums">02</span>
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            O cuidado é individual
          </p>
          <SplitText
            id="philosophy-title"
            text="Seu corpo, sua rotina, *seu caminho.*"
            className="display col-span-12 text-[clamp(2.4rem,5.6vw,5.25rem)] text-forest-deep lg:col-span-7"
          />
          <p className="lede col-span-12 self-end text-ink-soft md:col-span-7 lg:col-span-4 lg:col-start-9" data-fade>
            Cada pessoa possui uma história, necessidades e objetivos diferentes. Por isso, o acompanhamento nutricional deve considerar muito mais do que aquilo que está no prato.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-12 gap-x-6 lg:mt-28">
          <ol className="col-span-12 lg:col-span-8">
            {concepts.map((c) => (
              <li key={c.word} data-concept className={`relative pt-6 pb-8 lg:pt-8 lg:pb-10 ${c.indent}`}>
                <span data-rule aria-hidden className="absolute inset-x-0 top-0 block h-px bg-forest/20" />
                <div className="flex items-baseline gap-4 lg:gap-6">
                  <span data-meta className="serif-italic w-8 shrink-0 text-base text-sage-deep lg:text-lg">{c.n}</span>
                  <div>
                    <h3 data-word className="display text-[clamp(2.1rem,5.4vw,4.75rem)] text-forest-deep">
                      {c.word}
                    </h3>
                    <p data-meta className="mt-2 max-w-[26rem] text-[0.98rem] leading-relaxed text-ink-soft lg:mt-3">
                      {c.line}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Fotografias intercaladas, fora da grade óbvia */}
          <div className="col-span-12 mt-10 grid grid-cols-12 gap-6 lg:col-span-4 lg:mt-24 lg:flex lg:flex-col lg:gap-0">
            <figure className="col-span-7">
              <div data-clip className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
                <div data-parallax="0.1" className="absolute -inset-y-[6%] inset-x-0">
                  <Image
                    src="/media/frutas-suspensas.jpg"
                    alt="Frutas frescas — maçã, laranja, uvas, pera e morangos — suspensas sobre uma cesta de palha"
                    fill
                    sizes="(min-width: 1024px) 28vw, 58vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="serif-italic mt-3 text-sm text-ink-soft" data-fade>
                Não existe um único jeito certo de comer bem.
              </figcaption>
            </figure>
            <figure className="relative col-span-5 self-end lg:-mt-24 lg:-ml-[28%] lg:w-[52%] lg:self-start">
              <div data-clip className="relative aspect-square overflow-hidden rounded-full">
                <Image
                  src="/media/cesta-frutas.jpg"
                  alt="Cesta de palha com maçã, laranja, uvas e morangos"
                  fill
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
