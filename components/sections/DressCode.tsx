"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { t } from "@/lib/i18n";
import type { Lang, Section } from "@/lib/content/schema";

type DressCodeSection = Extract<Section, { type: "dressCode" }>;

type DressCodeProps = {
  section: DressCodeSection;
  lang: Lang;
  defaultLanguage: Lang;
};

export function DressCode({ section, lang, defaultLanguage }: DressCodeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Reveal className="flex flex-col items-center gap-6 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <p className="font-serif text-lg text-[var(--color-ink)]">
        {t(section.text, lang, defaultLanguage)}
      </p>
      <div className="flex gap-3">
        {section.palette.map((color, index) => (
          <motion.span
            // See the comment in Reveal.tsx: `initial` freezes at mount, so
            // the key must include `reducedMotion` to force a remount once
            // it resolves to its real value.
            key={`${color}-${reducedMotion}`}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={
              reducedMotion
                ? { duration: 0.4, delay: index * 0.08 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                    delay: index * 0.08,
                  }
            }
            style={{ backgroundColor: color }}
            className="h-9 w-9 rounded-full border border-[var(--color-accent-soft)]"
          />
        ))}
      </div>
    </Reveal>
  );
}
