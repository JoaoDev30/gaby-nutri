import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { PlateSection } from "@/components/PlateSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { PatientJourney } from "@/components/PatientJourney";
import { TrustSection } from "@/components/TrustSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTA } from "@/components/FinalCTA";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileCTABar } from "@/components/MobileCTABar";
import { MotionLayer } from "@/components/MotionLayer";

/** Dados estruturados apenas com informações reais (endereço/horário entram quando confirmados). */
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: "Acompanhamento nutricional individualizado.",
    url: siteConfig.url,
    telephone: `+${siteConfig.whatsapp.number}`,
    ...(siteConfig.instagram ? { sameAs: [siteConfig.instagram] } : {}),
    ...(siteConfig.city ? { address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressCountry: "BR" } } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="conteudo">
        <HeroSection />
        <StorySection />
        <PhilosophySection />
        <PlateSection />
        <ServicesSection />
        <AboutSection />
        <PatientJourney />
        <TrustSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <SiteFooter />
      <MobileCTABar />
      <MotionLayer />
      <StructuredData />
    </>
  );
}
