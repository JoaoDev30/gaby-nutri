/**
 * Rastreamento de cliques preparado para análise futura.
 * Não usa cookies nem envia dados a terceiros por conta própria:
 * apenas publica no `window.dataLayer` SE uma ferramenta (ex.: GTM) já tiver sido
 * carregada — o que deve acontecer somente após consentimento do visitante.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...params });
  window.dispatchEvent(new CustomEvent("site:track", { detail: { event, ...params } }));
}
