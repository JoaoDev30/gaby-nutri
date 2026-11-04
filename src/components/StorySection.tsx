"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitText } from "./ui/SplitText";
import { CitrusSlice, Leaf, Strike } from "./ui/Botanical";
import { gsap, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";

/** 02 — Quebra de expectativa: a palavra "restrição" é riscada enquanto o visitante rola. */
export function StorySection() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const title = q("[data-story-title]")[0];

      const tl = gsap.timeline({
        scrollTrigger: { trigger: title, start: "top 80%", end: "bottom 35%", scrub: 0.8 },
      });
      tl.to(q("[data-story-title] .split-word > span"), { y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" })
        .to(q("[data-strike]"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, ">-0.05")
        .to(q("[data-struck]"), { color: "var(--color-sage-deep)", duration: 0.4 }, "<0.2");

      // Transição de fundo creme → verde muito claro, conectando com a próxima seção.
      gsap.fromTo(
        root.current,
        { backgroundColor: "#f7f5ed" },
        {
          backgroundColor: "#e8eedb",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "35% bottom", end: "bottom bottom", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="story-title" className="relative overflow-hidden bg-cream pt-20 pb-24 lg:pt-36 lg:pb-40">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-[var(--gutter)]">
        <p className="eyebrow col-span-12 flex items-center gap-3 text-sage-deep" data-fade>
          <span className="tabular-nums">01</span>
          <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
          Uma nova perspectiva
        </p>

        <div className="col-span-12 lg:col-span-9" data-story-title>
          <SplitText
            id="story-title"
            auto={false}
            text="Alimentação saudável não precisa ser sinônimo de restrição."
            className="display text-[clamp(2.4rem,6.4vw,6rem)] text-ink"
            decorate={{
              "restrição": (
                <Strike className="pointer-events-none absolute top-[44%] left-[-3%] h-[0.5em] w-[106%] text-apricot" />
              ),
            }}
          />
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-7">
          <p className="lede text-ink-soft" data-fade>
            Comer bem não significa viver de salada, abandonar seus alimentos favoritos ou seguir uma rotina impossível.{" "}
            <span className="text-ink">
              Significa encontrar equilíbrio, respeitar suas necessidades e construir escolhas que façam sentido para você.
            </span>
          </p>
        </div>

        {/* Composição editorial — variedade e prazer à mesa */}
        <div className="relative col-span-12 mt-6 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-16">
          <figure className="col-span-12 md:col-span-8 lg:col-span-7">
            <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
              <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
                <Image
                  src="/media/mesa-variada.jpg"
                  alt="Mesa com iogurte e granola, ovos cozidos, abacate, kiwi, laranja, morangos, mirtilos e pão integral"
                  fill
                  sizes="(min-width: 1024px) 56vw, (min-width: 768px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 flex justify-between text-xs text-ink-soft" data-fade>
              <span>Cor, textura, sabor.</span>
              <span className="serif-italic text-sm">Tudo pode caber no prato.</span>
            </figcaption>
          </figure>

          <figure className="col-span-8 col-start-5 md:col-span-4 md:col-start-9 lg:col-span-4 lg:col-start-9 lg:mt-40">
            <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-t-full">
              <Image
                src="/media/ingredientes-suspensos.jpg"
                alt="Abacate, morangos, ovos, kiwi e laranja suspensos no ar sobre uma tigela"
                fill
                sizes="(min-width: 768px) 30vw, 66vw"
                className="object-cover"
              />
            </div>
          </figure>

          <CitrusSlice className="pointer-events-none absolute top-[58%] left-[2%] hidden size-24 text-apricot/60 md:block lg:top-auto lg:bottom-[-6%] lg:left-[60%]" scroll />
          <Leaf className="pointer-events-none absolute -top-10 right-[4%] h-28 w-auto text-sage-deep/50" scroll />
        </div>
      </div>
    </section>
  );
}
