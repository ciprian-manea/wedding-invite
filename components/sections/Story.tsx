"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { t } from "@/lib/i18n";
import type { Lang, Section } from "@/lib/content/schema";

type StorySection = Extract<Section, { type: "story" }>;

type StoryProps = {
  section: StorySection;
  lang: Lang;
  defaultLanguage: Lang;
};

const ROTATIONS = [-3, 2, -1.5];

export function Story({ section, lang, defaultLanguage }: StoryProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Reveal className="flex flex-col items-center gap-6 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <p className="font-serif text-lg leading-relaxed text-[var(--color-ink)]">
        {t(section.text, lang, defaultLanguage)}
      </p>
      {section.photos.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {section.photos.map((photo, index) => (
            <motion.div
              // See the comment in Reveal.tsx: `initial` freezes at mount, so
              // the key must include `reducedMotion` to force a remount once
              // it resolves to its real value.
              key={`${photo.src}-${reducedMotion}`}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 24, rotate: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: reducedMotion ? 0 : ROTATIONS[index % ROTATIONS.length],
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: reducedMotion ? 0 : index * 0.12,
              }}
              className="relative h-36 w-28 overflow-hidden rounded-sm bg-[var(--color-paper-deep)] shadow-md"
            >
              <Image
                src={photo.src}
                alt={t(photo.alt, lang, defaultLanguage)}
                fill
                sizes="140px"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}
    </Reveal>
  );
}
