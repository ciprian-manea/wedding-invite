import type { Content, Lang } from "@/lib/content/schema";
import { Sprig } from "@/components/ui/Sprig";
import { Countdown } from "./Countdown";
import { Story } from "./Story";
import { Schedule } from "./Schedule";
import { Venue } from "./Venue";
import { DressCode } from "./DressCode";
import { Gifts } from "./Gifts";
import { ScratchReveal } from "./ScratchReveal";
import { Rsvp } from "./Rsvp";
import { Footer } from "./Footer";

type SectionsProps = {
  content: Content;
  lang: Lang;
  guestLine?: string;
};

// A generated noise texture (no image asset needed), very faint, to keep
// the long run of sections from reading as flat, plain color.
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function Sections({ content, lang, guestLine }: SectionsProps) {
  const { sections, event, couple, defaultLanguage } = content;
  const eventTitle = `${couple.partner1} & ${couple.partner2}`;

  return (
    <div className="relative flex flex-col gap-20 px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: `url("${GRAIN_URL}")` }}
      />
      {sections.map((section, index) => {
        switch (section.type) {
          case "cover":
            // Rendered separately as the full-bleed hero.
            return null;
          case "countdown":
            return (
              <div key={index} className="relative">
                <Sprig className="pointer-events-none absolute -top-6 -right-4 h-36 w-36 text-[var(--color-accent)] opacity-[0.12]" />
                <Countdown
                  section={section}
                  eventDateTime={event.dateTime}
                  lang={lang}
                  defaultLanguage={defaultLanguage}
                />
              </div>
            );
          case "story":
            return (
              <Story
                key={index}
                section={section}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
          case "schedule":
            return (
              <div key={index} className="relative">
                <Sprig className="pointer-events-none absolute -bottom-6 -left-4 h-36 w-36 rotate-180 text-[var(--color-gold)] opacity-[0.12]" />
                <Schedule
                  section={section}
                  lang={lang}
                  defaultLanguage={defaultLanguage}
                />
              </div>
            );
          case "venue":
            return (
              <Venue
                key={index}
                section={section}
                lang={lang}
                defaultLanguage={defaultLanguage}
                eventDateTime={event.dateTime}
                eventTitle={eventTitle}
              />
            );
          case "dressCode":
            return (
              <DressCode
                key={index}
                section={section}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
          case "gifts":
            return (
              <Gifts
                key={index}
                section={section}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
          case "footer":
            return (
              <Footer
                key={index}
                section={section}
                monogram={couple.monogram}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
          case "scratchReveal":
            return (
              <ScratchReveal
                key={index}
                section={section}
                eventDateTime={event.dateTime}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
          case "rsvp":
            return (
              <Rsvp
                key={index}
                section={section}
                guestLine={guestLine}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
            );
        }
      })}
    </div>
  );
}
