"use client";

import { useEffect, useRef, useState } from "react";
import { navItems, siteConfig } from "@/config/site";
import { WhatsAppCTA } from "./ui/CTAButton";
import { track } from "@/lib/analytics";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Esconde ao descer, reaparece ao subir — mais espaço para leitura.
      setHidden(y > 480 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : (h) => h);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.menuOpen = "true";
    // Aguarda o painel sair de visibility:hidden antes de mover o foco.
    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>("a, button");
        const list = [toggleRef.current!, ...Array.from(f)];
        const idx = list.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          list[list.length - 1].focus();
        } else if (!e.shiftKey && idx === list.length - 1) {
          e.preventDefault();
          list[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.menuOpen;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-soft)] ${
        /* sem translate quando aberto: transform criaria contexto para o menu fixed */
        hidden && !open ? "-translate-y-full" : ""
      } ${
        scrolled && !open
          ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1440px] items-center justify-between gap-6 px-[var(--gutter)]">
        <a href="#inicio" className="group relative z-10 flex flex-col leading-none" aria-label={`${siteConfig.name}, ${siteConfig.role} — início`}>
          <span className="font-serif text-[1.35rem] whitespace-nowrap tracking-[-0.02em] text-forest-deep [font-variation-settings:'SOFT'_100,'opsz'_40]">
            Gabrielly <em className="font-light">Fernandes</em>
          </span>
          <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.28em] text-sage-deep uppercase">Nutricionista</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.92rem] font-medium text-ink-soft">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="relative py-2 transition-colors hover:text-forest after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-forest after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <WhatsAppCTA placement="header" size="md">
              Agendar consulta
            </WhatsAppCTA>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 flex size-11 items-center justify-center rounded-full ring-1 ring-forest/20 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 h-[1.5px] w-full bg-forest transition-transform duration-500 ease-[var(--ease-soft)] ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-forest transition-transform duration-500 ease-[var(--ease-soft)] ${open ? "top-1/2 -rotate-45" : "top-full"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        ref={menuRef}
        className={`fixed inset-0 z-0 flex flex-col bg-cream px-[var(--gutter)] pt-[calc(var(--header-h)+2.5rem)] pb-8 lg:hidden ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
        style={{
          // Visível imediatamente ao abrir (permite mover o foco); ao fechar, esconde só após a animação.
          transition: open
            ? "clip-path 0.7s var(--ease-soft)"
            : "clip-path 0.7s var(--ease-soft), visibility 0s linear 0.7s",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav aria-label="Menu mobile">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 font-serif text-[2.1rem] tracking-[-0.02em] text-forest-deep"
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                  <span className="font-sans text-xs tracking-[0.2em] text-sage-deep">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <p className="serif-italic text-lg text-ink-soft">{siteConfig.tagline}</p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              track("cta_whatsapp_click", { placement: "menu_mobile" });
              setOpen(false);
            }}
            className="flex h-14 items-center justify-center rounded-full bg-forest font-semibold text-cream"
          >
            Agendar minha consulta
          </a>
        </div>
      </div>
    </header>
  );
}
