"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { t, uiStrings } from "@/lib/i18n";
import type { Lang, Section } from "@/lib/content/schema";

type GiftsSection = Extract<Section, { type: "gifts" }>;

type GiftsProps = {
  section: GiftsSection;
  lang: Lang;
  defaultLanguage: Lang;
};

export function Gifts({ section, lang, defaultLanguage }: GiftsProps) {
  const strings = uiStrings[lang];
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!section.iban) return;
    try {
      await navigator.clipboard.writeText(section.iban);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (unsupported browser or no permission); nothing to recover.
    }
  }

  return (
    <Reveal className="flex flex-col items-center gap-5 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <p className="font-serif text-lg text-[var(--color-ink)]">
        {t(section.text, lang, defaultLanguage)}
      </p>
      {section.iban && (
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-1 rounded-[var(--radius-card)] bg-[var(--color-paper-deep)] px-5 py-3">
            <span className="font-sans text-sm tracking-[0.1em] text-[var(--color-ink)]">
              {section.iban}
            </span>
            {section.holder && (
              <span className="font-sans text-xs tracking-[0.1em] text-[var(--color-ink-soft)] uppercase">
                {section.holder}
              </span>
            )}
          </div>
          <Button onClick={handleCopy}>{strings.copyLabel}</Button>
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-7 rounded-full bg-[var(--color-accent)] px-3 py-1 font-sans text-xs text-[var(--color-paper)]"
              >
                {strings.copiedLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </Reveal>
  );
}
