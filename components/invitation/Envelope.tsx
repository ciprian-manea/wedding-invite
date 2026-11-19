"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import type { Lang } from "@/lib/content/schema";

type EnvelopeProps = {
  posterSrc: string;
  guestLine?: string;
  genericGreeting: string;
  dearLabel?: string;
  guestNames?: string;
  invitedLine: string;
  tapToOpenLabel: string;
  loadingLabel: string;
  loading: boolean;
  languages: Lang[];
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onTap: () => void;
  fadeDurationMs: number;
};

export function Envelope({
  posterSrc,
  guestLine,
  genericGreeting,
  dearLabel,
  guestNames,
  invitedLine,
  tapToOpenLabel,
  loadingLabel,
  loading,
  languages,
  lang,
  onLangChange,
  onTap,
  fadeDurationMs,
}: EnvelopeProps) {
  const reducedMotion = useReducedMotion();

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTap();
    }
  }

  return (
    <motion.div
      data-testid="envelope"
      role="button"
      tabIndex={0}
      aria-label={tapToOpenLabel}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      className="relative h-full w-full cursor-pointer overflow-hidden"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: fadeDurationMs / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="430px"
        className="object-cover object-center"
      />

      <div
        className="absolute inset-x-0 flex justify-center"
        style={{ top: "max(env(safe-area-inset-top), 16px)" }}
      >
        <LanguageSwitch
          languages={languages}
          lang={lang}
          onChange={onLangChange}
        />
      </div>

      <div className="absolute inset-x-0 bottom-[18%] flex flex-col items-center gap-3 px-8 text-center">
        {guestLine ? (
          <p className="font-serif text-xl text-[var(--color-ink)]">
            {guestLine}
          </p>
        ) : guestNames ? (
          <div className="flex flex-col items-center gap-1">
            {dearLabel && (
              <p className="font-[family-name:var(--font-display),var(--font-serif)] text-lg text-[var(--color-ink)]">
                {dearLabel}
              </p>
            )}
            <p className="font-[family-name:var(--font-display),var(--font-serif)] text-2xl text-[var(--color-accent)] italic">
              {guestNames}
            </p>
          </div>
        ) : (
          <p className="font-serif text-xl text-[var(--color-ink)]">
            {genericGreeting}
          </p>
        )}
        <p className="font-serif text-base text-[var(--color-ink-soft)]">
          {invitedLine}
        </p>

        {loading ? (
          <p className="mt-6 font-sans text-sm uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            {loadingLabel}
          </p>
        ) : (
          <motion.p
            className="mt-6 font-sans text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]"
            animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {tapToOpenLabel}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
