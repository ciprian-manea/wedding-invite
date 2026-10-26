"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { t, uiStrings } from "@/lib/i18n";
import {
  formatEventDate,
  getTimeRemaining,
  type TimeRemaining,
} from "@/lib/date";
import type { Lang, Section } from "@/lib/content/schema";

type CountdownSection = Extract<Section, { type: "countdown" }>;

type CountdownProps = {
  section: CountdownSection;
  eventDateTime: string;
  lang: Lang;
  defaultLanguage: Lang;
};

function DigitGroup({
  value,
  label,
  reducedMotion,
}: {
  value: number;
  label: string;
  reducedMotion: boolean;
}) {
  const display = value.toString().padStart(2, "0");
  const offset = reducedMotion ? 0 : 16;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-12 w-14 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-deep)]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: offset, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -offset, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-[var(--color-ink)]"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[11px] tracking-[0.15em] text-[var(--color-ink-soft)] uppercase">
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  section,
  eventDateTime,
  lang,
  defaultLanguage,
}: CountdownProps) {
  const reducedMotion = useReducedMotion();
  const strings = uiStrings[lang];
  // `new Date()` can't be used in the initial render: the server and the
  // client's first paint must match exactly, and "now" differs between them.
  // So the first paint always shows the placeholder below, and the real
  // countdown replaces it from an effect, which only ever runs client-side.
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const target = new Date(eventDateTime);
    function tick() {
      setRemaining(getTimeRemaining(target, new Date()));
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [eventDateTime]);

  const title = t(section.title, lang, defaultLanguage);

  if (remaining === null) {
    return (
      <Reveal className="flex flex-col items-center gap-6 text-center">
        <SectionTitle>{title}</SectionTitle>
        <div className="flex gap-3">
          <DigitGroup value={0} label={strings.days} reducedMotion />
          <DigitGroup value={0} label={strings.hours} reducedMotion />
          <DigitGroup value={0} label={strings.minutes} reducedMotion />
          <DigitGroup value={0} label={strings.seconds} reducedMotion />
        </div>
      </Reveal>
    );
  }

  if (remaining.totalMs <= 0) {
    return (
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <SectionTitle>{title}</SectionTitle>
        <p className="font-serif text-xl text-[var(--color-ink)]">
          {strings.todayLabel}
        </p>
        <p className="font-sans text-xs tracking-[0.15em] text-[var(--color-ink-soft)] uppercase">
          {formatEventDate(eventDateTime, lang)}
        </p>
      </Reveal>
    );
  }

  return (
    <Reveal className="flex flex-col items-center gap-6 text-center">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex gap-3">
        <DigitGroup
          value={remaining.days}
          label={strings.days}
          reducedMotion={reducedMotion}
        />
        <DigitGroup
          value={remaining.hours}
          label={strings.hours}
          reducedMotion={reducedMotion}
        />
        <DigitGroup
          value={remaining.minutes}
          label={strings.minutes}
          reducedMotion={reducedMotion}
        />
        <DigitGroup
          value={remaining.seconds}
          label={strings.seconds}
          reducedMotion={reducedMotion}
        />
      </div>
    </Reveal>
  );
}
