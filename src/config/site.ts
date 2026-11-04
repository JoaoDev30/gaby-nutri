/**
 * Configuração central do site.
 * Tudo que depende de confirmação da nutricionista está aqui ou marcado com <Pending>.
 * Antes de publicar: revise cada item com `pending: true` / `null`.
 */

export const siteConfig = {
  name: "Gabrielly Fernandes",
  role: "Nutricionista",
  tagline: "Saúde, equilíbrio e resultados reais.",

  /** URL pública do site (defina NEXT_PUBLIC_SITE_URL no deploy). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  whatsapp: {
    /** Somente dígitos, com DDI + DDD. Informado na arte de referência — confirmar antes de publicar. */
    number: "5561995032188",
    display: "(61) 99503-2188",
    message:
      "Olá, Gabrielly! Conheci seu site e gostaria de saber mais sobre o agendamento de uma consulta nutricional.",
  },

  /** Número do CRN — a confirmar (null exibe marcador "a confirmar"). */
  crn: null as string | null,

  /** Cidade/região de atendimento — a confirmar (usada em SEO local quando definida). */
  city: null as string | null,

  /** Instagram oficial — a confirmar. Ex.: "https://instagram.com/usuario" */
  instagram: null as string | null,

  /**
   * Foto profissional real da nutricionista.
   * Ex.: { src: "/media/gabrielly.jpg", alt: "Gabrielly Fernandes, nutricionista, sorrindo em seu consultório" }
   */
  portrait: null as { src: string; alt: string } | null,

  /**
   * Depoimentos reais, autorizados por escrito e em conformidade com as normas do CFN.
   * Não incluir fotos de antes/depois nem promessas de resultado.
   */
  testimonials: [] as { quote: string; author: string }[],

  /** Exibe marcadores visuais em conteúdos ainda não confirmados. Desligue só quando tudo estiver validado. */
  showPendingMarkers: true,
} as const;

export function whatsappHref(message: string = siteConfig.whatsapp.message) {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const navItems = [
  { href: "#sobre", label: "Sobre" },
  { href: "#atendimento", label: "Atendimento" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;
