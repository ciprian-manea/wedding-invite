"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { t } from "@/lib/i18n";
import type { Lang, Section } from "@/lib/content/schema";

type ScheduleSection = Extract<Section, { type: "schedule" }>;
type ScheduleIcon = ScheduleSection["items"][number]["icon"];

type ScheduleProps = {
  section: ScheduleSection;
  lang: Lang;
  defaultLanguage: Lang;
};

const ICONS: Record<ScheduleIcon, ReactNode> = {
  rings: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
    </svg>
  ),
  church: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M12 3v4M9 5h6" strokeLinecap="round" />
      <path d="M12 7l8 6h-16l8-6Z" strokeLinejoin="round" />
      <path d="M6 13v8h12v-8" />
      <path d="M10 21v-5h4v5" />
    </svg>
  ),
  glass: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path
        d="M6 4h12l-5 9v7h3M11 13v7H8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dinner: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9v3l2 2" strokeLinecap="round" />
    </svg>
  ),
  music: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M9 18V6l10-2v12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </svg>
  ),
  cake: (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M5 20h14v-6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v6Z" />
      <path d="M9 11V8M12 11V8M15 11V8" strokeLinecap="round" />
    </svg>
  ),
};

export function Schedule({ section, lang, defaultLanguage }: ScheduleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Reveal className="flex flex-col items-center gap-8 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <div ref={containerRef} className="relative w-full max-w-xs text-left">
        <div className="absolute top-2 bottom-2 left-[9px] w-px bg-[var(--color-accent-soft)]" />
        <motion.div
          className="absolute top-2 bottom-2 left-[9px] w-px origin-top bg-[var(--color-accent)]"
          style={{ scaleY: reducedMotion ? 1 : scaleY }}
        />
        <ul className="flex flex-col gap-8">
          {section.items.map((item, index) => (
            <motion.li
              // See the comment in Reveal.tsx: `initial` freezes at mount, so
              // the key must include `reducedMotion` to force a remount once
              // it resolves to its real value.
              key={`${item.time}-${index}-${reducedMotion}`}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4 pl-7"
            >
              <span className="absolute top-0 left-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-paper)] text-[var(--color-accent)]">
                {ICONS[item.icon]}
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-xs tracking-[0.15em] text-[var(--color-ink-soft)] uppercase">
                  {item.time}
                </span>
                <span className="font-serif text-lg text-[var(--color-ink)]">
                  {t(item.title, lang, defaultLanguage)}
                </span>
                {item.place && (
                  <span className="font-serif text-sm text-[var(--color-ink-soft)]">
                    {t(item.place, lang, defaultLanguage)}
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
