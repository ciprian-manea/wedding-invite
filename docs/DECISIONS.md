# Decisions

Append new decisions at the bottom: date, decision, why. Never rewrite old entries.

- 2026-10-18 · Opening is a pre-rendered video, not CSS/3D. Why: identical look on every phone, cinematic quality, simple code.
- 2026-10-18 · Music runs through Web Audio with a GainNode. Why: iOS ignores `audio.volume`, so fades need Web Audio.
- 2026-10-18 · Guest name is HTML over the poster, not baked into the video. Why: one video serves every guest.
- 2026-10-18 · H.264 MP4 in two sizes, no HEVC-only. Why: HEVC fails on many Android/Chrome devices.
- 2026-10-18 · Content in JSON files validated by Zod, no database in v1. Why: fastest path; the loader is the only thing to swap later.
- 2026-10-18 · Only `motion` for animation. Why: one library, React-friendly, enough for reveals and scroll effects.
- 2026-10-24 · `loadContent()` is marked `"use cache"`; `/demo` is marked `export const instant = false`. Why: this Next.js version (16, Cache Components on by default) errors at build/dev time on uncached file reads and on reading `searchParams` outside `<Suspense>` during prerendering. The content JSON read is static and cacheable; the page itself is genuinely per-request (guest line and language come from the URL), so it's marked as an allowed blocking route rather than forced into a Suspense shell for a single-route draft.
