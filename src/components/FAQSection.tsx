"use client";

import { useId, useState } from "react";
import { SplitText } from "./ui/SplitText";
import { Pending } from "./ui/Pending";
import { WhatsAppCTA } from "./ui/CTAButton";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";

type QA = { q: string; a: React.ReactNode };

/** Respostas que dependem do serviço estão marcadas com <Pending> para validação. */
const faqs: QA[] = [
  {
    q: "Como funciona a primeira consulta?",
    a: (
      <>
        <p>Na primeira consulta, conversamos sobre sua história, sua rotina, suas preferências e seus objetivos — é a partir disso que o acompanhamento é construído.</p>
        <p className="mt-3">
          <Pending label="validar com a Gabrielly">Duração, etapas da avaliação e o que levar no dia.</Pending>
        </p>
      </>
    ),
  },
  {
    q: "O plano alimentar é personalizado?",
    a: <p>Sim. O plano é construído a partir da sua rotina, das suas preferências e dos seus objetivos. Não existe cardápio pronto.</p>,
  },
  {
    q: "Preciso querer emagrecer para procurar uma nutricionista?",
    a: (
      <p>
        Não. A nutrição pode ajudar em objetivos muito diferentes: melhorar a qualidade da sua alimentação, cuidar da saúde, organizar a rotina alimentar ou simplesmente aprender a comer melhor — com prazer.
      </p>
    ),
  },
  {
    q: "Como faço para agendar?",
    a: (
      <p>
        Pelo WhatsApp: toque em qualquer botão “Agendar” deste site ou envie uma mensagem para{" "}
        <a
          className="font-semibold text-forest underline underline-offset-4"
          href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("cta_whatsapp_click", { placement: "faq_inline" })}
        >
          {siteConfig.whatsapp.display}
        </a>
        .
      </p>
    ),
  },
  {
    q: "O atendimento é presencial ou online?",
    a: (
      <Pending block label="validar com a Gabrielly">
        <p>Informar as modalidades disponíveis (presencial, online ou ambas) e, se houver, o endereço do consultório.</p>
      </Pending>
    ),
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" aria-labelledby="faq-title" className="relative bg-mist py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-12 px-[var(--gutter)]">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="eyebrow flex items-center gap-3 text-sage-deep" data-fade>
              <span className="tabular-nums">07</span>
              <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
              Dúvidas frequentes
            </p>
            <SplitText
              id="faq-title"
              text="Vamos esclarecer *suas dúvidas?*"
              className="display mt-6 text-[clamp(2.4rem,4.4vw,4.25rem)] text-forest-deep"
            />
            <div className="mt-10 hidden lg:block" data-fade>
              <p className="mb-5 max-w-[20rem] text-ink-soft">Não encontrou o que procurava? Pergunte diretamente.</p>
              <WhatsAppCTA placement="faq" variant="ghost" size="md">Falar no WhatsApp</WhatsAppCTA>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-forest/20">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const id = `${base}-${i}`;
              return (
                <li key={f.q} className="border-b border-forest/20" data-fade>
                  <h3>
                    <button
                      type="button"
                      id={`${id}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      onClick={() => {
                        setOpen(isOpen ? null : i);
                        if (!isOpen) track("faq_open", { question: f.q });
                      }}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left lg:py-8"
                    >
                      <span className="font-serif text-[clamp(1.25rem,1.8vw,1.65rem)] leading-snug tracking-[-0.01em] text-forest-deep [font-variation-settings:'SOFT'_60,'opsz'_48]">
                        {f.q}
                      </span>
                      <span aria-hidden className="relative flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-forest/25 transition-colors duration-300 group-hover:bg-forest group-hover:text-cream">
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-soft)] ${isOpen ? "scale-y-0" : ""}`} />
                      </span>
                    </button>
                  </h3>
                  <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="accordion-panel" data-open={isOpen} inert={!isOpen}>
                    <div>
                      <div className="max-w-[38rem] pb-8 text-[1.02rem] leading-relaxed text-ink-soft">{f.a}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 lg:hidden" data-fade>
            <WhatsAppCTA placement="faq" variant="ghost" size="md">Ainda com dúvidas? Fale comigo</WhatsAppCTA>
          </div>
        </div>
      </div>
    </section>
  );
}

