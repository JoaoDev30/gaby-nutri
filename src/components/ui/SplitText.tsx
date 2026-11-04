import { createElement, Fragment, type ElementType } from "react";

type Props = {
  /** Use *palavras* entre asteriscos para o itálico de destaque. */
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Desligue para controlar a animação pela própria seção. */
  auto?: boolean;
  /** Elemento extra renderizado após uma palavra (ex.: risco animado). Chave = palavra exata. */
  decorate?: Record<string, React.ReactNode>;
};

/**
 * Divide um título em palavras mascaradas para o reveal tipográfico.
 * O texto continua legível por leitores de tela e sem JavaScript.
 */
export function SplitText({ text, as = "h2", className, id, auto = true, decorate }: Props) {
  const tokens = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let i = 0;

  const words = tokens.flatMap((token) => {
    const italic = token.startsWith("*") && token.endsWith("*");
    const clean = italic ? token.slice(1, -1) : token;
    return clean
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, italic, key: i++ }));
  });

  return createElement(
    as,
    { className, id, "data-split": auto ? "" : "manual" },
    words.map(({ w, italic, key }, idx) => {
      const inner = italic ? <em>{w}</em> : w;
      const extra = decorate?.[w.replace(/[.,!?]/g, "")];
      return (
        <Fragment key={key}>
          <span className={`split-word${extra ? " relative" : ""}`}>
            <span>{inner}</span>
            {extra}
          </span>
          {idx < words.length - 1 ? " " : null}
        </Fragment>
      );
    }),
  );
}
