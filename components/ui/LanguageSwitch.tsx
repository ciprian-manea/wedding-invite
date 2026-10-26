import type { Lang } from "@/lib/content/schema";

type LanguageSwitchProps = {
  languages: Lang[];
  lang: Lang;
  onChange: (lang: Lang) => void;
  /** "plain" matches the envelope (over the poster art); "pill" is for the persistent post-reveal switcher. */
  variant?: "plain" | "pill";
  className?: string;
};

export function LanguageSwitch({
  languages,
  lang,
  onChange,
  variant = "plain",
  className,
}: LanguageSwitchProps) {
  if (languages.length < 2) return null;

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      {languages.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange(l);
            }}
            aria-pressed={active}
            className={
              variant === "pill"
                ? `flex min-h-11 min-w-11 items-center justify-center rounded-full font-sans text-xs tracking-[0.1em] uppercase transition-colors ${
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)]/90 text-[var(--color-ink-soft)] shadow-md backdrop-blur"
                  }`
                : `flex min-h-11 min-w-11 items-center justify-center px-2 font-sans text-xs tracking-[0.1em] uppercase ${
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-ink-soft)]"
                  }`
            }
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
