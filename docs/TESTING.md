# Testing and verification

A change is done only when you can show evidence: command output or screenshots.

## Every change
- `npm run typecheck` and `npm run lint` pass (the Stop hook also runs typecheck).
- Look at it at 390×844 with the Playwright MCP (configured as iPhone 15) and take a screenshot.

## Every milestone (use the `mobile-qa` subagent)
1. Open `/demo?to=Dragă%20Vasile`. Screenshot the envelope: name visible, "tap to open" visible, nothing cut off.
2. Tap the envelope. Screenshots at +0.5 s, +4 s and after the video ends.
3. Confirm: no black frame between envelope and video, no jump between video and page, scroll works after reveal.
4. Scroll through every section; screenshot each.
5. Switch language to ru and en; screenshot the envelope and two sections.
6. Emulate `prefers-reduced-motion: reduce`; tap; page appears without the video.
7. Console: zero errors and zero hydration warnings.
8. `npm run build` passes.

## Playwright tests (`tests/`)
- `opening.spec.ts`: tap → phase becomes revealed within 12 s; the video element got `play()`; body scroll unlocked.
- `content.spec.ts`: every section in demo.json renders a heading; invalid JSON fails `loadContent`.
- `i18n.spec.ts`: `?lang=ru` shows Russian strings.
Audio can't be heard in tests; assert that the AudioContext state is "running" after the tap.

## Real devices (owner does this; Claude can't)
- iPhone: Safari, and the link opened from WhatsApp. With the silent switch on and off.
- Android: Chrome, and from WhatsApp.
- Open via the LAN dev server (`npm run dev -- -H 0.0.0.0`, then `http://<computer-ip>:3000/demo`) or the Vercel preview.
- Lighthouse mobile on the Vercel preview: performance ≥ 90.
