# Content schema

One JSON file per wedding in `content/<slug>.json`, validated by Zod in `lib/content/schema.ts`.
Every user-facing string is a `Localized` object: `{ "ro": "...", "ru": "...", "en": "..." }`.
Only the languages listed in `languages` are required; `t()` falls back to `defaultLanguage`.

## Types (write the Zod schema from this)
```ts
type Lang = "ro" | "ru" | "en";
type Localized = Partial<Record<Lang, string>>;

interface Content {
  slug: string;                      // "demo"
  design: "jardin-blanc";
  languages: Lang[];                 // order = order in the switch
  defaultLanguage: Lang;
  couple: { partner1: string; partner2: string; monogram: string };   // monogram "A&I"
  greeting: { generic: Localized; invitedLine: Localized; tapToOpen: Localized };
  event: {
    dateTime: string;                // ISO with offset, "2027-06-12T15:00:00+03:00"
    timezone: string;                // "Europe/Chisinau"
    rsvpDeadline: string;            // ISO date
  };
  music: { src: string; credit?: string };
  sections: Section[];               // rendered in this order; omit a section to hide it
}

type Section =
  | { type: "cover"; subtitle: Localized; quote?: Localized }
  | { type: "countdown"; title: Localized }
  | { type: "story"; title: Localized; text: Localized; photos: { src: string; alt: Localized }[] }
  | { type: "schedule"; title: Localized; items: { time: string; title: Localized; place?: Localized; icon: "rings" | "church" | "glass" | "dinner" | "music" | "cake" }[] }
  | { type: "venue"; title: Localized; places: { name: string; address: string; mapsUrl: string; image?: string; addToCalendar: boolean }[] }
  | { type: "dressCode"; title: Localized; text: Localized; palette: string[] }   // hex colors
  | { type: "gifts"; title: Localized; text: Localized; iban?: string; holder?: string }
  | { type: "scratchReveal"; title: Localized; hint: Localized }                   // reveals event date
  | { type: "rsvp"; title: Localized; text: Localized; askAllergies: boolean; askSong: boolean; maxSeats: number }
  | { type: "footer"; text: Localized };
```

## Example `content/demo.json` (shortened, create the full one)
```json
{
  "slug": "demo",
  "design": "jardin-blanc",
  "languages": ["ro", "ru", "en"],
  "defaultLanguage": "ro",
  "couple": { "partner1": "Ana", "partner2": "Ion", "monogram": "A&I" },
  "greeting": {
    "generic": { "ro": "Dragi invitați", "ru": "Дорогие гости", "en": "Dear guests" },
    "invitedLine": { "ro": "sunteți invitați la nunta noastră", "ru": "приглашаем вас на нашу свадьбу", "en": "you are invited to our wedding" },
    "tapToOpen": { "ro": "Atinge pentru a deschide", "ru": "Нажмите, чтобы открыть", "en": "Tap to open" }
  },
  "event": { "dateTime": "2027-06-12T15:00:00+03:00", "timezone": "Europe/Chisinau", "rsvpDeadline": "2027-05-20" },
  "music": { "src": "/media/jardin-blanc/music.m4a", "credit": "Placeholder tone" },
  "sections": [
    { "type": "cover", "subtitle": { "ro": "Ne căsătorim", "ru": "Мы женимся", "en": "We're getting married" } },
    { "type": "countdown", "title": { "ro": "Până la marea zi", "ru": "До большого дня", "en": "Until the big day" } },
    { "type": "scratchReveal", "title": { "ro": "Data", "ru": "Дата", "en": "The date" }, "hint": { "ro": "Răzuiește", "ru": "Сотрите", "en": "Scratch" } },
    { "type": "rsvp", "title": { "ro": "Confirmare", "ru": "Подтверждение", "en": "RSVP" }, "text": { "ro": "Vă rugăm să confirmați până la 20 mai", "ru": "Пожалуйста, подтвердите до 20 мая", "en": "Please reply by 20 May" }, "askAllergies": true, "askSong": true, "maxSeats": 4 },
    { "type": "footer", "text": { "ro": "Cu drag, Ana și Ion", "ru": "С любовью, Анна и Ион", "en": "With love, Ana & Ion" } }
  ]
}
```

## Rules
- Invalid content fails the build with a readable Zod error (path + message).
- Guest line from `?to=` is plain text: trim, max 80 characters, render as text (never as HTML).
