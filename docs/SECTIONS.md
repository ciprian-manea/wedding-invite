# Sections

Every section: full width of the 430 px phone column, generous vertical space (min 80 px between sections),
centered text, a small ornament divider above the title, and a scroll-in reveal (`<Reveal>`: fade + 16 px rise,
600 ms, `whileInView`, `once: true`, `amount: 0.3`). Reduced motion: no movement, opacity only.

| Section | Content | Animation / behaviour |
| --- | --- | --- |
| Cover | Hero = last-frame image full screen. Names in script font, "&" between, subtitle, date. | Names appear letter by letter (40 ms stagger) after reveal; slow 1.04 zoom on the image over 12 s; a few falling petals (canvas, ≤ 12 particles, paused off-screen). |
| Countdown | Days · hours · minutes · seconds to `event.dateTime`. | Digits roll on change. After the date passes, show "Today is the day" / the wedding date. |
| Story | Title, short text, 1–3 photos. | Photos rise in one after another (120 ms stagger), slight rotation like printed photos. |
| Schedule | Vertical timeline: time, icon, title, place. | The vertical line draws down as you scroll (`useScroll` + `scaleY`); items fade in as the line reaches them. |
| Venue | Name, address, image, "Open in Maps" button, "Add to calendar" (.ics download + Google Calendar link). | Card reveal. Buttons ≥ 44 px tall. |
| Dress code | Text + color dots from `palette`. | Dots pop in with a small spring. |
| Gifts | Text, optional IBAN and holder, "Copy" button. | Copy shows a small "Copied" toast (no toast library; a tiny component). |
| Scratch reveal | A card covered with a paper texture; scratching with a finger reveals the date. | Canvas with `globalCompositeOperation = "destination-out"`; check cleared % every 200 ms; at 55 % clear the rest with a fade and fire confetti. Must not scroll the page while scratching (`touch-action: none` on the canvas only). |
| RSVP | Name (prefilled from guest line), attending yes/no, seats (1…maxSeats), allergies, song, message. | Big friendly controls. On submit (draft): validate, show a thank-you state + confetti, `console.info` the payload. No network call yet. |
| Footer | Thank-you line, monogram. | Fade in. |

## Shared UI
- `SectionTitle`: script font, accent color, 40–48 px.
- Body text: serif, 18–20 px, line-height 1.6, ink color. Never below 16 px.
- Buttons: pill shape, accent outline, uppercase sans 13 px with letter spacing, min height 48 px.
- Tap targets ≥ 44 × 44 px. Respect `env(safe-area-inset-*)`.

## Adding a new section
Use the `/new-section` skill: add the Zod type, the component, the i18n strings, add it to `demo.json`,
and a screenshot check at 390 × 844.
