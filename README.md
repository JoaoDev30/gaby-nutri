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
| Hero (vídeo controlado pelo scroll) | quadros em `public/frames/desktop` e `public/frames/mobile`; posters em `public/media/hero-*.jpg`; configuração em `src/lib/frameSequence.ts` (`HERO_FRAMES`) e timeline em `src/components/HeroSection.tsx` |
| Tokens de movimento (duração, easing, stagger, scrub) | `src/lib/motion.ts` |
| Fotografias | `public/media/*.jpg` (hoje são quadros extraídos dos vídeos Higgsfield) |
| Cores e tipografia | `src/app/globals.css` (`@theme`) |
| URL pública (SEO/OG/sitemap) | variável `NEXT_PUBLIC_SITE_URL` |

Os arquivos originais dos vídeos ficam em `assets/` (não são servidos).

### Hero: por que sequência de quadros e não `<video>`

O MP4 original do Higgsfield (1920×1080, 24 fps, 12 s, H.264) tem **um único keyframe** em 289 quadros: cada mudança de `currentTime` obriga o decoder a reconstruir desde o início, e o scrub trava. Comparação feita (trecho com movimento, 0–8,8 s):

| Opção | Desktop | Mobile |
| --- | --- | --- |
| MP4 só com keyframes (`-g 1`) | 7,8 MB | 3,6 MB |
| **Sequência WebP em canvas (escolhida)** | **4,0 MB** (107 quadros, 1600×900) | **3,4 MB** (107 quadros, 860×860) |

Os quadros carregam de forma progressiva (1º quadro → último → espaçados → todos); enquanto um não chegou, o canvas mostra o vizinho mais próximo. Com economia de dados/2G, só 1 a cada 4 quadros é baixado. Os ~3 s finais do vídeo são praticamente estáticos, por isso a sequência vai até 8,8 s e termina no último quadro real.

Regerar (sem alterar o original em `assets/`):

```bash
ffmpeg -i assets/hero-v2-alimentos.mp4 -t 8.8 -vf "select='not(mod(n\,2))',scale=1600:900" -fps_mode vfr -c:v libwebp -quality 66 -compression_level 6 -start_number 0 public/frames/desktop/f%03d.webp
ffmpeg -i assets/hero-v2-alimentos.mp4 -t 8.8 -vf "select='not(mod(n\,2))',crop=1080:1080:740:0,scale=860:860" -fps_mode vfr -c:v libwebp -quality 60 -compression_level 6 -start_number 0 public/frames/mobile/f%03d.webp
ffmpeg -sseof -0.05 -i assets/hero-v2-alimentos.mp4 -frames:v 1 -vf scale=1600:900 -c:v libwebp -quality 66 public/frames/desktop/f106.webp
ffmpeg -sseof -0.05 -i assets/hero-v2-alimentos.mp4 -frames:v 1 -vf "crop=1080:1080:740:0,scale=860:860" -c:v libwebp -quality 60 public/frames/mobile/f106.webp
```

Se o número de quadros mudar, ajuste `count` em `HERO_FRAMES`.

### Mapa de motion

| Seção | Efeito (referência Não Codei) |
| --- | --- |
| Hero | sequência quadro a quadro (03) + pin + 4 momentos de texto palavra por palavra (16) + capítulos que se desenham (07) + máscara circular de saída (05) |
| 02 | texto que se preenche (04) + risco em "restrição" + fundo creme → verde-claro |
| 03 | revelação editorial + parallax sutil |
| 04 | linha vertical de progresso + imagem sticky |
| 05 | abertura da fotografia + reveal tipográfico |
| 06 | linha do tempo que se desenha e acende as etapas (07) |
| 07–08 | entradas discretas, accordion acessível |
| 09 | prato que se abre em círculo (05) |

Os efeitos da vitrine Não Codei foram usados como referência de princípio e reimplementados com GSAP — nenhum código foi copiado (a página não declara licença).

## Estrutura

`src/components/` — `SiteHeader`, `HeroSection`, `StorySection`, `PhilosophySection`, `ServicesSection`, `AboutSection`, `PatientJourney`, `TrustSection`, `FAQSection`, `FinalCTA`, `SiteFooter`, `MobileCTABar`, `MotionLayer` (animações genéricas por `data-*`), `ui/` (botão WhatsApp, texto dividido, ilustrações botânicas, marcador de pendência).

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
