# Architecture

## Stack (approved dependencies)
| Purpose | Package |
| --- | --- |
| Framework | `next` (latest, App Router), `react`, TypeScript strict |
| Styling | `tailwindcss` (v4) with CSS variables for theme tokens |
| Animation | `motion` (import from "motion/react") |
| Validation | `zod` |
| Confetti | `canvas-confetti` |
| Fonts | `next/font/google`: Cormorant Garamond, Pinyon Script, Jost (self-hosted at build) |
| Dev | `prettier`, `eslint` (from create-next-app), `@playwright/test` |

Anything else: ask first and log it in docs/DECISIONS.md.

## Folders
```text
app/
  layout.tsx              fonts, <html lang>, metadata (noindex)
  page.tsx                redirects to /demo for now
  demo/page.tsx           loads content/demo.json, reads ?to= and ?lang=, renders <Invitation>
components/
  invitation/
    Invitation.tsx        client root: state machine idle → opening → revealed
    Envelope.tsx          poster + name overlay + "tap to open" + language switch
    OpeningVideo.tsx      the <video> layer
    MusicController.tsx   Web Audio fade, mute button, visibility pause
  sections/               one file per section (Cover, Countdown, Story, Schedule, Venue,
                          DressCode, Gifts, ScratchReveal, Rsvp, Footer)
  ui/                     Reveal (scroll-in wrapper), SectionTitle, Ornament, Button
lib/
  content/schema.ts       Zod schema + inferred types
  content/load.ts         reads and validates content/<slug>.json (server only)
  i18n.ts                 t(texts, lang) helper and UI strings per language
  ics.ts                  builds an .ics file and a Google Calendar URL
designs/
  jardin-blanc/theme.ts   colors, fonts, radii, motion timings for this design
content/
  demo.json               the demo wedding
public/media/jardin-blanc/
  poster.jpg                    first frame of the video (made by scripts/encode-media.sh)
  open-1080.mp4, open-720.mp4   opening video
  last-frame.jpg                last frame of the video
  music.m4a (+ optional music.mp3)
  illustrations/*.webp
assets-src/               original masters (large, not committed; see .gitignore)
scripts/                  media scripts
tests/                    Playwright tests
```

## Data flow
1. `app/demo/page.tsx` (server component) calls `loadContent("demo")`, which validates the JSON with Zod.
2. It reads `searchParams.to` (guest line) and `searchParams.lang`, then passes plain props to `<Invitation>`.
3. `<Invitation>` (client component) owns the phase state and renders Envelope, OpeningVideo, MusicController and the sections.
4. Sections receive only their own block of content plus `lang`.

Later the loader will read a guest by token instead of `?to=`. Keep the loader the only place that knows where content comes from.

## Theme
Each design exports a `theme` object; `<Invitation>` writes it to CSS variables on its root
(`--color-paper`, `--color-ink`, `--color-accent`, `--font-script`, …). Components use only the variables,
so a new design is a new theme file + media, not new components.
