import type { Content, Lang } from "@/lib/content/schema";
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

export function Sections({ content, lang, guestLine }: SectionsProps) {
  const { sections, event, couple, defaultLanguage } = content;
  const eventTitle = `${couple.partner1} & ${couple.partner2}`;

  return (
    <div className="flex flex-col gap-20 px-6 py-16">
      {sections.map((section, index) => {
        switch (section.type) {
          case "cover":
            // Rendered separately as the full-bleed hero.
            return null;
          case "countdown":
            return (
              <Countdown
                key={index}
                section={section}
                eventDateTime={event.dateTime}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
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
              <Schedule
                key={index}
                section={section}
                lang={lang}
                defaultLanguage={defaultLanguage}
              />
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
