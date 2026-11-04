"use client";

import { whatsappHref } from "@/config/site";
import { track } from "@/lib/analytics";

type Variant = "primary" | "light" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-forest text-cream hover:bg-forest-deep",
  light: "bg-cream text-forest-deep hover:bg-white",
  ghost:
    "bg-transparent text-forest ring-1 ring-inset ring-forest/30 hover:ring-forest/70 hover:bg-forest/5",
};

/** Botão de agendamento: abre o WhatsApp com mensagem pré-preenchida e registra o clique. */
export function WhatsAppCTA({
  children,
  placement,
  variant = "primary",
  className = "",
  size = "lg",
}: {
  children: React.ReactNode;
  placement: string;
  variant?: Variant;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("cta_whatsapp_click", { placement })}
      data-cta={placement}
      className={`group relative inline-flex items-center justify-center gap-3 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-soft)] active:scale-[0.98] ${
        size === "lg" ? "h-14 px-7 text-[0.98rem]" : "h-11 px-5 text-sm"
      } ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowIcon />
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex size-6 items-center justify-center overflow-hidden rounded-full bg-current/10 ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-[150%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 16 16"
        className="absolute size-3.5 -translate-x-[150%] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
