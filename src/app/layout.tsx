import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const title = "Gabrielly Fernandes · Nutricionista | Nutrição individualizada";
const description =
  "Acompanhamento nutricional individualizado, que respeita sua rotina, suas preferências e seus objetivos. Avaliação com bioimpedância e plano alimentar personalizado. Agende pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: `${siteConfig.name} · Nutricionista`,
    title: "Comer bem é viver melhor — Gabrielly Fernandes, Nutricionista",
    description,
    images: [{ url: "/media/og.jpg", width: 1200, height: 630, alt: "Frutas, ovos, abacate e granola compondo uma esfera sobre uma tigela" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/media/og.jpg"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ed",
  width: "device-width",
  initialScale: 1,
};

/** Liga os estados iniciais de animação antes da pintura — com failsafe caso o JS não carregue. */
const motionBoot = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
