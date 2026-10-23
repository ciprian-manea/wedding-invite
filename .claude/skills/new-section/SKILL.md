---
name: new-section
description: Add a new section type to the invitation (schema, component, i18n, demo content, check). Use when the user asks for a new section such as a FAQ, a photo gallery or accommodation.
argument-hint: [section name and what it should show]
---

Add a new invitation section: $ARGUMENTS

1. Read docs/SECTIONS.md, docs/DESIGN_SYSTEM.md and docs/CONTENT_SCHEMA.md.
2. Add the section's type to the Zod union in `lib/content/schema.ts`; every visible string is `Localized`.
3. Create `components/sections/<Name>.tsx`. Use `Reveal`, `SectionTitle` and theme CSS variables only;
   respect reduced motion; tap targets ≥ 44 px.
4. Register it in the section renderer's switch, so TypeScript forces every type to be handled.
5. Add an example block to `content/demo.json` in all languages.
6. Add a row to the table in docs/SECTIONS.md and update docs/CONTENT_SCHEMA.md.
7. Typecheck, then screenshot it at 390x844 with the Playwright MCP in ro and en.
