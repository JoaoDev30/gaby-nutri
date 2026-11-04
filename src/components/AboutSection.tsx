import Image from "next/image";
import { siteConfig } from "@/config/site";
import { SplitText } from "./ui/SplitText";
import { WhatsAppCTA } from "./ui/CTAButton";
import { Pending } from "./ui/Pending";
import { Sprig, Leaf } from "./ui/Botanical";

/** 05 — Apresentação da nutricionista. Sem currículo inventado: dados reais entram por siteConfig. */
export function AboutSection() {
  const { portrait, crn } = siteConfig;

  return (
    <section id="sobre" aria-labelledby="about-title" className="relative overflow-hidden bg-cream pt-10 pb-24 lg:pt-16 lg:pb-40">
      {/* Arco de fundo — eco da forma das fotografias */}
      <div aria-hidden className="absolute top-24 -left-[20vw] h-[110vw] w-[70vw] rounded-t-full bg-mist/70 lg:top-10 lg:-left-[6vw] lg:h-[54vw] lg:w-[44vw]" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-12 px-[var(--gutter)] lg:items-center">
        <figure className="relative col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1">
          <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[#dce8e1]">
            {portrait ? (
              <Image src={portrait.src} alt={portrait.alt} fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 p-8 text-center">
                <Sprig className="absolute top-[16%] left-1/2 h-[46%] w-auto -translate-x-1/2 text-forest/25" scroll />
                <span className="pending-tag">foto a inserir</span>
                <p className="max-w-[18rem] text-sm text-forest/70">
                  Fotografia profissional real da Gabrielly — retrato com luz natural, fundo neutro.
                </p>
              </div>
            )}
          </div>
          <figcaption className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-full bg-cream px-5 py-3 shadow-[0_12px_40px_-16px_rgb(32_42_34/0.35)] lg:-right-10 lg:left-auto">
            <span className="size-2 rounded-full bg-sage-deep" aria-hidden />
            <span className="text-sm font-semibold text-forest-deep">
              Nutricionista · CRN{" "}
              {crn ? crn : <Pending label="a confirmar">nº</Pending>}
            </span>
          </figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="eyebrow flex items-center gap-3 text-sage-deep" data-fade>
            <span className="tabular-nums">04</span>
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            Sobre mim
          </p>
          <SplitText
            id="about-title"
            text="Prazer, sou *Gabrielly Fernandes.*"
            className="display mt-6 text-[clamp(2.5rem,4.4vw,4.4rem)] text-forest-deep"
          />

          <div className="mt-8 max-w-[34rem] space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
            <p data-fade>
              Acredito em uma nutrição que cabe na vida real. Meu trabalho é entender sua rotina, seus objetivos e a sua relação com a comida para construir, junto com você, escolhas que façam sentido — sem fórmulas prontas.
            </p>
            <div data-fade>
              <Pending block label="texto a ser fornecido pela Gabrielly">
                Breve apresentação pessoal: formação, trajetória e o que motivou a escolha pela nutrição. (2 a 3 frases, em primeira pessoa.)
              </Pending>
            </div>
            <blockquote data-fade className="relative border-l border-sage pl-6">
              <p className="serif-italic text-[1.45rem] leading-snug text-forest-deep">“{siteConfig.tagline}”</p>
            </blockquote>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" data-fade>
            <WhatsAppCTA placement="about">Agendar minha consulta</WhatsAppCTA>
            {siteConfig.instagram && (
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-forest underline underline-offset-4">
                Acompanhe no Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <Leaf className="pointer-events-none absolute right-[6%] bottom-10 hidden h-32 w-auto text-sage-deep/40 lg:block" scroll />
    </section>
  );
}
