# Wedding invitation (v1 draft)

A mobile-first digital wedding invitation. The guest taps a sealed envelope, a short pre-rendered
video opens it, music fades in, and the page scrolls through the wedding details.
Right now we are building ONLY the invitation draft (see docs/PROJECT.md for scope).

## Read these when relevant
- Scope and what is out of scope: @docs/PROJECT.md
- Stack, folders, data flow: @docs/ARCHITECTURE.md
- Progress and the next task: @docs/TASKS.md
- Opening sequence spec (the most important feature): docs/OPENING_SEQUENCE.md
- Content JSON schema and example: docs/CONTENT_SCHEMA.md
- Sections and their animations: docs/SECTIONS.md
- Colors, type, motion rules: docs/DESIGN_SYSTEM.md
- Media specs and encoding: docs/ASSETS.md
- Making the artwork, video takes and music (prompts, review, assembly): docs/ART_BRIEF.md and the `/art` skill
- How to verify work: docs/TESTING.md
- Past decisions (append, never rewrite): docs/DECISIONS.md

## Commands
- `npm run dev` · dev server (use `npm run dev -- -H 0.0.0.0` to open it on a phone on the same Wi-Fi)
- `npm run typecheck` · `npm run lint` · `npm run build`
- `bash scripts/make-placeholder-media.sh` · creates placeholder poster, video, last frame and music
- `bash scripts/encode-media.sh <design>` · encodes real media from assets-src/<design>/
- `bash scripts/review-take.sh <video>` · contact sheet + first/last frame of a video take, for review with the Read tool
- `bash scripts/assemble-opening.sh <design> <clip...>` · joins chosen takes into assets-src/<design>/open.mp4

## Rules
- IMPORTANT: Mobile first. Every UI change is checked at 390x844 (iPhone) before it counts as done.
- IMPORTANT: All wedding text comes from `content/*.json`, validated by the Zod schema in `lib/content/schema.ts`. Never hard-code names, dates or copy in components.
- All artwork, video, music and copy must be our own or licensed. Never copy assets, text or code from other invitation sites (for example thedigitalyes.com).
- Animations: use `motion` (import from "motion/react"). No other animation library without a note in docs/DECISIONS.md.
- Keep dependencies few. Ask before adding a package not listed in docs/ARCHITECTURE.md.
- Respect `prefers-reduced-motion` in every animated component.
- When a milestone is finished: run typecheck, lint and build, run the mobile-qa subagent, tick the boxes in docs/TASKS.md, and commit.
- When compacting, keep: the current milestone, files changed, and open problems.
