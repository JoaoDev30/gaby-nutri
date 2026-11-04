"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { WhatsAppCTA } from "./ui/CTAButton";
import { Sprig, Leaf } from "./ui/Botanical";
import { gsap, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";

/** 09 — Conclusão da jornada: o prato composto (último quadro do vídeo) se abre em círculo. */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-orb]"),
        { clipPath: "circle(18% at 50% 50%)" },
        {
          clipPath: "circle(50% at 50% 50%)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        q("[data-orb] img"),
        { scale: 1.25, rotate: -6 },
        { scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.8 } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="agendar" aria-labelledby="final-title" className="on-dark grain relative isolate overflow-hidden bg-forest text-cream">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 items-center gap-x-6 gap-y-12 px-[var(--gutter)] py-24 lg:min-h-[92svh] lg:py-32">
        <div className="relative col-span-12 lg:col-span-6 lg:order-2 lg:col-start-7">
          <div className="relative mx-auto aspect-square w-[78%] max-w-[560px] lg:w-full">
            <div data-orb className="absolute inset-0 overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)]">
              <Image
                src="/media/prato-composto.jpg"
                alt="Frutas, ovos, abacate e granola compondo uma esfera sobre uma tigela"
                fill
                sizes="(min-width: 1024px) 40vw, 78vw"
                className="object-cover object-[67%_50%]"
              />
            </div>
            <Sprig className="pointer-events-none absolute -bottom-6 -left-10 h-44 w-auto -rotate-12 text-sage/70" scroll />
            <Leaf className="pointer-events-none absolute -top-4 -right-4 h-28 w-auto rotate-[24deg] text-sage/60" scroll />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:order-1">
          <p className="eyebrow flex items-center gap-3 text-sage" data-fade>
            <span aria-hidden className="h-px w-8 bg-sage/60" />
            Seu próximo passo
          </p>
          <SplitText
            id="final-title"
            text="Seu bem-estar *merece atenção.*"
            className="display mt-6 text-[clamp(2.75rem,6.4vw,6rem)]"
          />
          <p className="lede mt-8 max-w-[30rem] text-cream/80" data-fade>
            Comece uma nova relação com a alimentação, com orientação profissional e respeito à sua individualidade.
          </p>
          <div className="mt-10" data-fade>
            <WhatsAppCTA placement="final" variant="light" className="w-full sm:w-auto">
              Quero agendar minha consulta
            </WhatsAppCTA>
            <p className="mt-4 text-sm text-cream/60">Você será direcionado ao WhatsApp com uma mensagem pronta.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
