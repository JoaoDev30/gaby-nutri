/**
 * Sequência de quadros desenhada em <canvas>, controlada externamente (ScrollTrigger).
 *
 * Por que não <video> + currentTime: o MP4 original do Higgsfield tem um único keyframe
 * em 289 quadros; cada seek obriga o decoder a reconstruir a partir do início e o scrub trava.
 * Imagens WebP independentes desenham instantaneamente e em qualquer ordem.
 *
 * Carregamento progressivo (sem baixar tudo de uma vez):
 *  1º quadro → quadros espaçados (passo 16, 8, 4, 2) → todos.
 * Enquanto um quadro não chegou, desenha o vizinho carregado mais próximo.
 * Em conexões lentas / economia de dados, carrega só 1 a cada 4 quadros.
 */

export type FrameSet = {
  /** Ex.: (i) => `/frames/desktop/f${pad(i)}.webp` */
  url: (i: number) => string;
  count: number;
  /** Ponto focal horizontal/vertical do recorte "cover" (0–1). */
  focusX: number;
  focusY: number;
};

type Connection = { saveData?: boolean; effectiveType?: string };

export class FrameSequence {
  private images: (HTMLImageElement | null)[];
  private ctx: CanvasRenderingContext2D | null;
  private current = -1;
  private target = 0;
  private raf = 0;
  private disposed = false;
  private queue: number[] = [];
  private inFlight = 0;
  private stride = 1;
  onFirstFrame?: () => void;

  constructor(private canvas: HTMLCanvasElement, private set: FrameSet) {
    this.images = new Array(set.count).fill(null);
    this.ctx = canvas.getContext("2d", { alpha: false });
    const conn = (navigator as Navigator & { connection?: Connection }).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    this.stride = slow ? 4 : 1;
    this.queue = this.buildOrder();
    this.resize();
    this.pump();
  }

  private buildOrder() {
    const { count } = this.set;
    const seen = new Set<number>();
    const order: number[] = [];
    const push = (i: number) => {
      if (i >= 0 && i < count && !seen.has(i) && i % this.stride === 0) {
        seen.add(i);
        order.push(i);
      }
    };
    push(0);
    seen.add(count - 1);
    order.push(count - 1);
    for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) push(i);
    return order;
  }

  private pump() {
    while (!this.disposed && this.inFlight < 6 && this.queue.length) {
      const i = this.queue.shift()!;
      this.inFlight++;
      const img = new Image();
      img.decoding = "async";
      img.src = this.set.url(i);
      const done = (ok: boolean) => {
        this.inFlight--;
        if (this.disposed) return;
        if (ok) {
          this.images[i] = img;
          if (i === 0) this.onFirstFrame?.();
          // Redesenha se este quadro está mais perto do alvo que o atual.
          if (Math.abs(i - this.target) < Math.abs(this.current - this.target) || this.current === -1) {
            this.current = -2;
            this.schedule();
          }
        }
        this.pump();
      };
      img.decode().then(() => done(true), () => done(img.complete && img.naturalWidth > 0));
    }
  }

  private nearestLoaded(i: number) {
    if (this.images[i]) return i;
    for (let d = 1; d < this.set.count; d++) {
      if (this.images[i - d]) return i - d;
      if (this.images[i + d]) return i + d;
    }
    return -1;
  }

  /** progress 0–1 → quadro. */
  setProgress(p: number) {
    const i = Math.round(Math.min(1, Math.max(0, p)) * (this.set.count - 1));
    if (i === this.target && this.current === i) return;
    this.target = i;
    this.schedule();
  }

  private schedule() {
    if (this.raf || this.disposed) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  private draw() {
    const idx = this.nearestLoaded(this.target);
    if (idx < 0 || !this.ctx) return;
    if (idx === this.current) return;
    const img = this.images[idx]!;
    const { width: cw, height: ch } = this.canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * this.set.focusX;
    const dy = (ch - dh) * this.set.focusY;
    this.ctx.drawImage(img, dx, dy, dw, dh);
    this.current = idx;
    this.canvas.dataset.frame = String(idx); // útil para QA/depuração
  }

  /** Ajusta a resolução do canvas ao tamanho exibido (limitado a 2x e à resolução das imagens). */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (w === this.canvas.width && h === this.canvas.height) return;
    this.canvas.width = w;
    this.canvas.height = h;
    if (this.ctx) this.ctx.imageSmoothingQuality = "high";
    this.current = -2;
    this.schedule();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.queue = [];
    this.images = [];
  }
}

const pad = (i: number) => String(i).padStart(3, "0");

export const HERO_FRAMES = {
  desktop: { url: (i: number) => `/frames/desktop/f${pad(i)}.webp`, count: 107, focusX: 0.72, focusY: 0.5 },
  mobile: { url: (i: number) => `/frames/mobile/f${pad(i)}.webp`, count: 107, focusX: 0.5, focusY: 0.5 },
} satisfies Record<string, FrameSet>;
