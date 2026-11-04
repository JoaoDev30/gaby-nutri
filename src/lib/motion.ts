/**
 * Tokens de movimento — uma única linguagem para o site inteiro.
 * Referência de princípios: vitrine "Não Codei" (efeitos 03, 04, 05, 07 e 16),
 * reimplementados com GSAP.
 */
export const DUR = {
  fast: 0.5,
  base: 0.9,
  reveal: 1.1, // títulos palavra por palavra
  slow: 1.4, // fotografias / máscaras
} as const;

export const EASE = {
  /** Saída editorial — equivalente a cubic-bezier(.16,1,.3,1). */
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
  /** Tudo que é amarrado ao scroll anda linear: quem dá o ritmo é o visitante. */
  scroll: "none",
} as const;

export const STAGGER = {
  words: 0.06, // ~70 ms por palavra (efeito 16)
  items: 0.09,
} as const;

/** Suavização do scrub: pequena, para não "atrasar" a mão do usuário. */
export const SCRUB = 0.6;

/** Ponto de disparo padrão das entradas por viewport. */
export const START = "top 86%";

/** Intensidade do parallax (fração do elemento). */
export const PARALLAX = 0.1;

/** Texto que se preenche (efeito 04): cor inicial e largura do degradê em palavras. */
export const FILL = { from: 0.18, spread: 3 } as const;
