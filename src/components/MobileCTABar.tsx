"use client";

import { useEffect, useState } from "react";
import { WhatsAppCTA } from "./ui/CTAButton";

/** Barra fixa de agendamento no mobile: aparece após o hero e some no CTA final / rodapé. */
export function MobileCTABar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const final = document.getElementById("agendar");
    if (!hero || !final) return;
    let heroVisible = true;
    let finalVisible = false;
    const update = () => setVisible(!heroVisible && !finalVisible);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === final) finalVisible = e.isIntersecting || e.boundingClientRect.top < 0;
      });
      update();
    });
    io.observe(hero);
    io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-500 ease-[var(--ease-soft)] [html[data-menu-open]_&]:hidden lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="rounded-full bg-cream/80 p-1.5 shadow-[0_10px_40px_-12px_rgb(32_42_34/0.45)] backdrop-blur-md">
        <WhatsAppCTA placement="mobile_bar" className="w-full !h-12">
          Agendar minha consulta
        </WhatsAppCTA>
      </div>
    </div>
  );
}
