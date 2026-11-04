# Gabrielly Fernandes · Nutricionista — site

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger. Página única, estática.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Onde editar

| O quê | Onde |
| --- | --- |
| WhatsApp, mensagem, CRN, cidade, Instagram, foto, depoimentos | `src/config/site.ts` |
| Marcadores "a confirmar" (desligar só após validar tudo) | `showPendingMarkers` em `src/config/site.ts` |
| Vídeo do hero | `public/video/hero-1080.mp4` e `hero-720.mp4` (+ `public/media/hero-poster.jpg`) — constantes em `src/components/HeroVideo.tsx` |
| Fotografias | `public/media/*.jpg` (hoje são quadros extraídos dos vídeos Higgsfield) |
| Cores e tipografia | `src/app/globals.css` (`@theme`) |
| URL pública (SEO/OG/sitemap) | variável `NEXT_PUBLIC_SITE_URL` |

Os arquivos originais dos vídeos ficam em `assets/` (não são servidos).

### Recriar o vídeo otimizado

```bash
ffmpeg -i assets/hero-v2-alimentos.mp4 -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart public/video/hero-1080.mp4
ffmpeg -i assets/hero-v2-alimentos.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart public/video/hero-720.mp4
```

## Estrutura

`src/components/` — `SiteHeader`, `HeroSection` (+ `HeroVideo`), `StorySection`, `PhilosophySection`, `ServicesSection`, `AboutSection`, `PatientJourney`, `TrustSection`, `FAQSection`, `FinalCTA`, `SiteFooter`, `MobileCTABar`, `MotionLayer` (animações genéricas por `data-*`), `ui/` (botão WhatsApp, texto dividido, ilustrações botânicas, marcador de pendência).

Movimento: só roda sem `prefers-reduced-motion`. Sem JavaScript ou com movimento reduzido, todo o conteúdo aparece normalmente e o hero mostra uma imagem estática.

Eventos de clique (`cta_whatsapp_click`, `cta_secondary_click`, `faq_open`) vão para `window.dataLayer` **somente se** uma ferramenta de análise já estiver carregada — instale-a apenas após consentimento.

## Informações a confirmar com a Gabrielly

1. **Número do WhatsApp** (61) 99503-2188 e texto da mensagem inicial.
2. **CRN** (número e região).
3. **Fotografia profissional** real para a seção "Sobre".
4. **Apresentação pessoal** (2–3 frases: formação, trajetória, motivação).
5. **Modalidade de atendimento**: presencial, online ou ambos — e endereço, se houver.
6. **Cidade/região** de atendimento (SEO local e dados estruturados).
7. **Primeira consulta**: duração, etapas da avaliação, o que levar.
8. **Etapas da jornada do paciente** (seção "Como funciona") — validar o texto.
9. **Depoimentos** reais, autorizados por escrito e conformes às normas do CFN (opcional).
10. **Instagram** ou outros canais oficiais.
11. **Domínio** definitivo (`NEXT_PUBLIC_SITE_URL`).
12. Textos de apoio escritos para os serviços, conceitos e compromissos — revisar se refletem a prática dela.
