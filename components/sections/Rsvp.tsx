"use client";

import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { t, uiStrings } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Lang, Section } from "@/lib/content/schema";

type RsvpSection = Extract<Section, { type: "rsvp" }>;

type RsvpProps = {
  section: RsvpSection;
  guestLine?: string;
  lang: Lang;
  defaultLanguage: Lang;
};

type Attending = "yes" | "no" | null;

const fieldLabelClassName =
  "font-sans text-xs tracking-[0.1em] text-[var(--color-ink-soft)] uppercase";
// `scroll-mb` matches the shared Button component: keeps a focused field
// from landing flush with the viewport bottom when a mobile keyboard's
// auto-scroll brings it into view, where the fixed mute/language chrome
// (see Invitation.tsx) would otherwise sit on top of it.
const fieldInputClassName =
  "min-h-12 w-full rounded-[var(--radius-card)] border border-[var(--color-accent-soft)] bg-[var(--color-paper)] px-4 font-serif text-lg text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none scroll-mb-[calc(env(safe-area-inset-bottom)+76px)]";

export function Rsvp({ section, guestLine, lang, defaultLanguage }: RsvpProps) {
  const strings = uiStrings[lang];
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(guestLine ?? "");
  const [attending, setAttending] = useState<Attending>(null);
  const [seats, setSeats] = useState(1);
  const [allergies, setAllergies] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError(strings.rsvpErrorName);
      return;
    }
    if (attending === null) {
      setError(strings.rsvpErrorAttending);
      return;
    }
    setError(null);

    const payload = {
      name: name.trim(),
      attending: attending === "yes",
      ...(attending === "yes" && {
        seats,
        ...(section.askAllergies && {
          allergies: allergies.trim() || undefined,
        }),
        ...(section.askSong && { song: song.trim() || undefined }),
        message: message.trim() || undefined,
      }),
    };
    console.info("[RSVP]", payload);
    setSubmitted(true);

    if (!reducedMotion && sectionRef.current) {
      const styles = getComputedStyle(sectionRef.current);
      const colors = [
        styles.getPropertyValue("--color-accent").trim(),
        styles.getPropertyValue("--color-gold").trim(),
        styles.getPropertyValue("--color-accent-soft").trim(),
      ].filter(Boolean);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors.length > 0 ? colors : undefined,
      });
    }
  }

  if (submitted) {
    return (
      <Reveal
        className="flex flex-col items-center gap-4 text-center"
        amount={0}
      >
        <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
        <p className="font-serif text-xl text-[var(--color-ink)]">
          {strings.rsvpThankYou}
        </p>
      </Reveal>
    );
  }

  return (
    <Reveal className="flex flex-col items-center gap-6 text-center">
      <div ref={sectionRef} className="flex w-full flex-col items-center gap-6">
        <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
        <p className="font-serif text-lg text-[var(--color-ink)]">
          {t(section.text, lang, defaultLanguage)}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-5"
        >
          <label className="flex w-full flex-col items-start gap-1 text-left">
            <span className={fieldLabelClassName}>{strings.rsvpNameLabel}</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldInputClassName}
            />
          </label>

          <div className="flex w-full flex-col items-center gap-2">
            <span className={fieldLabelClassName}>
              {strings.rsvpAttendingLabel}
            </span>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((option) => {
                const active = attending === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAttending(option)}
                    aria-pressed={active}
                    className={`min-h-12 min-w-24 scroll-mb-[calc(env(safe-area-inset-bottom)+76px)] rounded-full border font-sans text-sm tracking-[0.1em] uppercase transition-colors ${
                      active
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-paper)]"
                        : "border-[var(--color-accent-soft)] text-[var(--color-ink-soft)]"
                    }`}
                  >
                    {option === "yes" ? strings.rsvpYes : strings.rsvpNo}
                  </button>
                );
              })}
            </div>
          </div>

          {attending === "yes" && (
            <>
              <label className="flex w-full flex-col items-start gap-1 text-left">
                <span className={fieldLabelClassName}>
                  {strings.rsvpSeatsLabel}
                </span>
                <input
                  type="number"
                  min={1}
                  max={section.maxSeats}
                  value={seats}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    const clamped = Math.min(
                      Math.max(next || 1, 1),
                      section.maxSeats,
                    );
                    setSeats(clamped);
                  }}
                  className={fieldInputClassName}
                />
              </label>

              {section.askAllergies && (
                <label className="flex w-full flex-col items-start gap-1 text-left">
                  <span className={fieldLabelClassName}>
                    {strings.rsvpAllergiesLabel}
                  </span>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(event) => setAllergies(event.target.value)}
                    className={fieldInputClassName}
                  />
                </label>
              )}

              {section.askSong && (
                <label className="flex w-full flex-col items-start gap-1 text-left">
                  <span className={fieldLabelClassName}>
                    {strings.rsvpSongLabel}
                  </span>
                  <input
                    type="text"
                    value={song}
                    onChange={(event) => setSong(event.target.value)}
                    className={fieldInputClassName}
                  />
                </label>
              )}

              <label className="flex w-full flex-col items-start gap-1 text-left">
                <span className={fieldLabelClassName}>
                  {strings.rsvpMessageLabel}
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  className={`${fieldInputClassName} min-h-24 resize-none py-3`}
                />
              </label>
            </>
          )}

          {error && (
            <p
              className="font-sans text-sm text-[var(--color-error)]"
              role="alert"
            >
              {error}
            </p>
          )}

          <Button type="submit">{strings.rsvpSubmit}</Button>
        </form>
      </div>
    </Reveal>
  );
}
