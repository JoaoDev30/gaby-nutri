import { siteConfig } from "@/config/site";
import { SplitText } from "./ui/SplitText";
import { Pending } from "./ui/Pending";

/**
 * 07 — Confiança. Só credibilidade real: compromissos da abordagem (do posicionamento da marca),
 * dados profissionais verificáveis e espaço para depoimentos autorizados.
 * Normas: depoimentos devem seguir o Código de Ética do Nutricionista e as resoluções do CFN
 * sobre publicidade (sem antes/depois, sem promessa de resultado).
 */
const commitments = [
  { title: "Nada de cardápio pronto", text: "Cada orientação parte da sua rotina, das suas preferências e dos seus objetivos." },
  { title: "Comer com prazer", text: "Alimentação saudável inclui cultura, afeto e os alimentos de que você gosta." },
  { title: "Transparência em cada etapa", text: "Você entende o porquê de cada orientação e participa das decisões do seu plano." },
];

export function TrustSection() {
  const { testimonials, crn } = siteConfig;

  return (
    <section aria-labelledby="trust-title" className="relative bg-cream py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-12 px-[var(--gutter)]">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow flex items-center gap-3 text-sage-deep" data-fade>
            <span className="tabular-nums">06</span>
            <span aria-hidden className="h-px w-8 bg-sage-deep/60" />
            Confiança
          </p>
          <SplitText
            id="trust-title"
            text="Cuidado de verdade começa com *confiança.*"
            className="display mt-6 text-[clamp(2.4rem,4.6vw,4.5rem)] text-forest-deep"
          />
          <p className="lede mt-8 max-w-[28rem] text-ink-soft" data-fade>
            Sem promessas milagrosas e sem fórmulas prontas: um acompanhamento honesto, conduzido por uma profissional habilitada.
          </p>
          <dl className="mt-10 grid max-w-[28rem] grid-cols-2 gap-6 border-t border-line pt-6 text-sm" data-fade>
            <div>
              <dt className="eyebrow text-[0.65rem] text-sage-deep">Registro profissional</dt>
              <dd className="mt-2 font-semibold text-forest-deep">CRN {crn ?? <Pending>nº</Pending>}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.65rem] text-sage-deep">Atendimento</dt>
              <dd className="mt-2 font-semibold text-forest-deep">
                {siteConfig.city ?? <Pending>cidade / modalidade</Pending>}
              </dd>
            </div>
          </dl>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-line">
            {commitments.map((c, i) => (
              <li key={c.title} className="group grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-8 lg:py-10" data-fade>
                <span className="serif-italic pt-1 text-lg text-sage-deep" aria-hidden>
                  {["i.", "ii.", "iii."][i]}
                </span>
                <div>
                  <h3 className="display text-[clamp(1.6rem,2.4vw,2.25rem)] text-forest-deep transition-transform duration-700 ease-[var(--ease-soft)] group-hover:translate-x-1.5">
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-[30rem] leading-relaxed text-ink-soft">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>

          {testimonials.length > 0 ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.author} data-fade>
                  <blockquote className="serif-italic text-xl leading-snug text-forest-deep">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-ink-soft">— {t.author}</figcaption>
                </figure>
              ))}
            </div>
          ) : siteConfig.showPendingMarkers ? (
            <div className="mt-14" data-fade>
              <Pending block label="espaço reservado · depoimentos">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Área preparada para depoimentos reais, autorizados por escrito pelos pacientes e em conformidade com as normas do CFN. Nenhum depoimento será exibido até que existam.
                </p>
              </Pending>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
