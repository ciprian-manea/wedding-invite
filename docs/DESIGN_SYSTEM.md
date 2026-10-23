# Design system: Jardin Blanc

An original design: an embossed ivory envelope, a sage green wax seal with the couple's monogram,
white roses and soft greenery, light and airy, romantic and calm. Our own artwork only.

## Tokens (`designs/jardin-blanc/theme.ts`)
| Token | Value | Use |
| --- | --- | --- |
| `--color-paper` | `#F7F2E8` | page background |
| `--color-paper-deep` | `#EDE4D3` | cards, scratch cover |
| `--color-ink` | `#3E3A33` | body text |
| `--color-ink-soft` | `#7A7266` | secondary text |
| `--color-accent` | `#7E8F6E` | sage: titles, buttons, seal |
| `--color-accent-soft` | `#C9D1BC` | dividers, outlines |
| `--color-gold` | `#B89B6A` | fine lines and ornaments only |
| `--font-script` | Pinyon Script | names, section titles |
| `--font-serif` | Cormorant Garamond | body text |
| `--font-sans` | Jost | small caps labels, buttons |
| `--radius-card` | 20px | cards |
| `--ease-soft` | cubic-bezier(0.22, 1, 0.36, 1) | all reveals |

Check contrast: body text on paper must pass WCAG AA (≥ 4.5:1). Script font only at ≥ 32 px.

## Texture
- A subtle paper grain over the page background (a small tiling WebP at 4–6 % opacity), not a heavy image.
- Ornament dividers: thin gold SVG lines with a small leaf, drawn as inline SVG components.

## Motion principles
- Slow and soft: 500–900 ms, `--ease-soft`. Nothing bounces except the color dots.
- One thing moves at a time; stagger, don't flood.
- Never animate layout properties (width/height/top); use transform and opacity.
- Reduced motion: replace movement with a short fade.

## Layout
- Phone column max-width 430 px, centered. Outside it on wide screens: `--color-paper-deep` with the paper grain.
- Side padding 24 px. Sections separated by ≥ 80 px.
