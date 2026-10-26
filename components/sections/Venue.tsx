"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button, ButtonLink } from "@/components/ui/Button";
import { t, uiStrings } from "@/lib/i18n";
import { buildIcsFile, googleCalendarUrl } from "@/lib/ics";
import type { Lang, Section } from "@/lib/content/schema";

type VenueSection = Extract<Section, { type: "venue" }>;

type VenueProps = {
  section: VenueSection;
  lang: Lang;
  defaultLanguage: Lang;
  eventDateTime: string;
  eventTitle: string;
};

function downloadIcs(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function Venue({
  section,
  lang,
  defaultLanguage,
  eventDateTime,
  eventTitle,
}: VenueProps) {
  const strings = uiStrings[lang];

  return (
    <Reveal className="flex flex-col items-center gap-8 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <div className="flex w-full flex-col gap-6">
        {section.places.map((place) => {
          const icsEvent = {
            title: eventTitle,
            location: place.address,
            startISO: eventDateTime,
          };
          return (
            <div
              key={place.name}
              className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-paper-deep)] p-5"
            >
              {place.image && (
                <div className="relative h-40 w-full overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src={place.image}
                    alt=""
                    fill
                    sizes="382px"
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-serif text-xl text-[var(--color-ink)]">
                {place.name}
              </p>
              <p className="font-serif text-base text-[var(--color-ink-soft)]">
                {place.address}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ButtonLink
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {strings.openInMaps}
                </ButtonLink>
                {place.addToCalendar && (
                  <>
                    <Button
                      onClick={() =>
                        downloadIcs(
                          `${place.name.replace(/\s+/g, "-").toLowerCase()}.ics`,
                          buildIcsFile(icsEvent),
                        )
                      }
                    >
                      {strings.addToCalendar}
                    </Button>
                    <ButtonLink
                      href={googleCalendarUrl(icsEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {strings.googleCalendarLabel}
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
