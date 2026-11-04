import { navItems, siteConfig, whatsappHref } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-forest-deep pt-16 pb-28 text-cream/75 lg:pb-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-[var(--gutter)]">
        <div className="col-span-12 lg:col-span-5">
          <p className="font-serif text-[2rem] leading-none tracking-[-0.02em] text-cream [font-variation-settings:'SOFT'_100,'opsz'_72]">
            Gabrielly <em className="font-light">Fernandes</em>
          </p>
          <p className="mt-3 text-sm">
            Nutricionista · CRN {siteConfig.crn}
          </p>
          <p className="serif-italic mt-6 text-lg text-sage">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="col-span-6 lg:col-span-3">
          <p className="eyebrow mb-4 text-[0.65rem] text-sage">Navegação</p>
          <ul className="space-y-2.5 text-sm">
            {navItems.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-cream">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 lg:col-span-4">
          <p className="eyebrow mb-4 text-[0.65rem] text-sage">Contato</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">
                WhatsApp {siteConfig.whatsapp.display}
              </a>
            </li>
            {siteConfig.instagram && (
              <li>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Instagram</a>
              </li>
            )}
            <li>{siteConfig.attendance}</li>
          </ul>
        </div>

        <div className="col-span-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>© 2026 {siteConfig.name}. Todos os direitos reservados.</p>
          <p>As informações deste site não substituem uma consulta individual.</p>
        </div>
      </div>
    </footer>
  );
}
