# Tasks

Work one milestone per session (`/milestone <n>`). Tick boxes as you go. Each milestone ends with
typecheck + lint + build passing, a mobile-qa run, and a commit.

## M0 · Project setup
- [ ] Check the Next.js app the owner created (TypeScript, Tailwind, ESLint, App Router, no src/ dir) runs with `npm run dev`; remove the create-next-app demo content
- [ ] Add `motion`, `zod`, `canvas-confetti`, `prettier`, `@playwright/test`; scripts `typecheck`, `lint`, `format`
- [ ] Folder structure from docs/ARCHITECTURE.md; `.gitignore` includes `assets-src/`
- [ ] Fonts with `next/font/google`; theme tokens in `designs/jardin-blanc/theme.ts` applied as CSS variables
- [ ] Zod schema + `loadContent()`; full `content/demo.json` in ro/ru/en
- [ ] Run `bash scripts/make-placeholder-media.sh`
- [ ] `/demo` renders the couple names on the paper background
- **Accept:** typecheck, lint, build pass; screenshot at 390×844.

## M1 · Opening sequence
- [ ] `Invitation` state machine (idle → opening → revealed) exactly as in docs/OPENING_SEQUENCE.md
- [ ] `Envelope`: poster, guest line from `?to=`, invited line, pulsing tap hint, language switch
- [ ] `OpeningVideo`: source by screen size, first-frame handoff, ended/timeout/error handling, Skip button
- [ ] `MusicController`: Web Audio gain fade, audioSession playback, mute button, visibility pause
- [ ] Reduced motion path, slow-network loader, scroll lock
- [ ] `tests/opening.spec.ts`
- **Accept:** mobile-qa steps 1–3, 6, 7 pass; owner confirms on a real iPhone and Android.

## M2 · Content sections
- [ ] `Reveal`, `SectionTitle`, `Ornament` UI pieces
- [ ] Cover (letter animation, slow zoom, petals), Countdown, Story, Schedule (drawn line), Venue + `lib/ics.ts`, Dress code, Gifts (copy IBAN), Footer
- [ ] `tests/content.spec.ts`
- **Accept:** every section screenshot at 390×844 in ro; no layout shift.

## M3 · Interactive sections and languages
- [ ] Scratch reveal with confetti
- [ ] RSVP form UI (prefilled name, validation, thank-you state)
- [ ] Language switch everywhere, `?lang=` support, `<html lang>` updated
- [ ] `tests/i18n.spec.ts`
- **Accept:** full mobile-qa checklist passes.

## M4 · Polish, performance, preview deploy
- [ ] Motion pass: timings and easing per docs/DESIGN_SYSTEM.md
- [ ] Images AVIF/WebP with sizes, fonts subset, video preload strategy checked
- [ ] Accessibility: contrast, focus states, alt texts, button labels
- [ ] `noindex` metadata; Open Graph title/image for the demo
- [ ] Deploy to Vercel preview
- **Accept:** Lighthouse mobile ≥ 90 on the preview; owner tests from WhatsApp on both phones.

## Art track (owner + `/art`, in parallel with M0–M4)
- [ ] Frame A (closed envelope) generated, upscaled, retouched
- [ ] Monogram SVG made (`/art monogram`) and placed on the seal
- [ ] Frame B (flap open) made from A, matching camera and light
- [ ] Frame C (orangery scene)
- [ ] `/art review` passed for A, B, C
- [ ] Clip 1 takes (A → B) generated and reviewed; best take chosen
- [ ] Clip 2 takes (B → C) generated and reviewed; best take chosen
- [ ] `/art assemble` → `assets-src/jardin-blanc/open.mp4`, 8–10 s, still first 1.5 s and last 2 s
- [ ] Music licensed, saved as `music.wav`, licence PDF kept
- **Accept:** `/art review` on open.mp4 shows no warping, flicker or jumps.

## M5 · Real assets
- [ ] Owner puts masters in `assets-src/jardin-blanc/`
- [ ] `/encode-media jardin-blanc`; check sizes and the first/last-frame match
- [ ] Tune overlay position to the real envelope art
- **Accept:** handoff invisible on both phones with the real video.
