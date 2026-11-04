"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK, useIsoLayoutEffect } from "@/lib/gsap";

type Photo = { kind: "photo"; src: string; alt: string; label: string; shape: string };
type Note = { kind: "note"; text: string; tone: "forest" | "apricot" | "mist" };
type Item = Photo | Note;

const items: Item[] = [
  {
    kind: "photo",
    src: "/media/mesa-variada.jpg",
    alt: "Mesa com iogurte e granola, ovos cozidos, abacate, kiwi, laranja, morangos, mirtilos e pão integral",
    label: "Cor",
    shape: "aspect-[4/3] rounded-[2px]",
  },
  { kind: "note", text: "Sem *proibições.*", tone: "forest" },
  {
    kind: "photo",
    src: "/media/ingredientes-suspensos.jpg",
    alt: "Abacate, morangos, ovos, kiwi e laranja suspensos no ar sobre uma tigela",
    label: "Textura",
    shape: "aspect-[4/5] rounded-t-full",
  },
  {
    kind: "photo",
    src: "/media/bowl-detalhe.jpg",
    alt: "Tigela de iogurte com granola cercada de frutas",
    label: "Sabor",
    shape: "aspect-[4/5] rounded-[2px]",
  },
  { kind: "note", text: "Seus favoritos *continuam* no prato.", tone: "apricot" },
  {
    kind: "photo",
    src: "/media/prato-poster.jpg",
    alt: "Prato com frango grelhado, arroz, feijão, batata-doce, legumes e folhas",
    label: "Equilíbrio",
    shape: "aspect-square rounded-full",
  },
  {
    kind: "photo",
    src: "/media/frutas-suspensas.jpg",
    alt: "Frutas frescas suspensas no ar",
    label: "Leveza",
    shape: "aspect-[4/5] rounded-[2px]",
  },
  { kind: "note", text: "Escolhas que fazem *sentido* para você.", tone: "mist" },
  {
    kind: "photo",
    src: "/media/ingredientes-em-movimento.jpg",
    alt: "Frutas, ovos e oleaginosas em movimento acima de uma tigela",
    label: "Prazer",
    shape: "aspect-[4/5] rounded-b-full",
  },
];

const tones = {
  forest: "bg-forest text-cream [&_em]:text-sage",
  apricot: "bg-apricot/35 text-forest-deep [&_em]:text-sage-deep",
  mist: "bg-mist text-forest-deep [&_em]:text-sage-deep",
} as const;

/** "Sem *proibições.*" → trecho entre asteriscos em itálico. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

/** Numeração só das fotos (01, 02…), ignorando os cartões de texto. */
const photoNumber = items.map((_, i) => items.slice(0, i + 1).filter((it) => it.kind === "photo").length);

function Strip({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      data-set
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-start gap-[var(--g)] pr-[var(--g)] ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {items.map((it, i) => {
        if (it.kind === "note") {
          return (
            <li key={i} className="shrink-0">
              <div
                className={`flex h-[var(--h)] w-[calc(var(--h)*0.72)] flex-col justify-between rounded-[2px] p-[clamp(1.1rem,2vw,2rem)] ${tones[it.tone]}`}
              >
                <span aria-hidden className="h-px w-8 bg-current opacity-40" />
                <p className="display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.05]">
                  <Rich text={it.text} />
                </p>
              </div>
            </li>
          );
        }
        return (
          <li key={i} className="shrink-0">
            <figure>
              <div className={`relative h-[var(--h)] overflow-hidden ${it.shape}`}>
                <Image
                  src={it.src}
                  alt={hidden ? "" : it.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 70vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-2 text-xs text-ink-soft">
                <span className="tabular-nums text-sage-deep">0{photoNumber[i]}</span>
                <span className="serif-italic text-sm text-ink">{it.label}</span>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Galeria horizontal em loop contínuo (adaptação do efeito "02 · Galeria horizontal").
 * A fita anda para o lado sozinha, sem fim: o conjunto é renderizado duas vezes e a
 * posição dá a volta ao completar a largura de um conjunto. A rolagem da página dá um
 * empurrão de velocidade; passar o mouse desacelera para ver com calma.
 * Só anima enquanto está na tela. Com movimento reduzido: fita parada, rolável na mão.
 */
export function StoryGallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const el = track.current!;
      const set = el.querySelector<HTMLElement>("[data-set]")!;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const BASE = desktop ? 55 : 38; // px/s
      let width = set.offsetWidth;
      let x = 0;
      let boost = 0;
      let factor = 1;
      let targetFactor = 1;
      let visible = false;

      const ro = new ResizeObserver(() => {
        width = set.offsetWidth;
      });
      ro.observe(set);

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => {
          boost = Math.min(900, Math.abs(self.getVelocity()) * 0.35);
        },
      });
      visible = st.isActive;

      const tick = (_t: number, dt: number) => {
        if (!visible || !width) return;
        factor += (targetFactor - factor) * 0.06;
        boost *= 0.93;
        x -= ((BASE + boost) * factor * Math.min(dt, 64)) / 1000;
        if (x <= -width) x += width;
        el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      };
      gsap.ticker.add(tick);

      const slow = () => (targetFactor = 0.2);
      const fast = () => (targetFactor = 1);
      root.current!.addEventListener("pointerenter", slow);
      root.current!.addEventListener("pointerleave", fast);
      const node = root.current!;

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        ro.disconnect();
        node.removeEventListener("pointerenter", slow);
        node.removeEventListener("pointerleave", fast);
        el.style.transform = "";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative mt-6 overflow-hidden [--g:clamp(0.9rem,1.6vw,1.6rem)] [--h:clamp(16rem,34vw,30rem)] motion-reduce:overflow-x-auto lg:mt-16"
      role="region"
      aria-label="Galeria: variedade e prazer à mesa"
    >
      <div ref={track} className="flex w-max pl-[var(--gutter)] will-change-transform motion-reduce:will-change-auto">
        <Strip />
        <Strip hidden />
      </div>
    </div>
  );
}
