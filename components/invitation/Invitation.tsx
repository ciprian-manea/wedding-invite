import { themeCssVars } from "@/designs/jardin-blanc/theme";
import { t } from "@/lib/i18n";
import type { Content, Lang } from "@/lib/content/schema";

type InvitationProps = {
  content: Content;
  lang: Lang;
};

export function Invitation({ content, lang }: InvitationProps) {
  const { couple, greeting, defaultLanguage } = content;

  return (
    <div
      style={themeCssVars as React.CSSProperties}
      className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-paper)] px-6 py-24 text-center"
    >
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
        {t(greeting.generic, lang, defaultLanguage)}
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-script)] text-5xl text-[var(--color-accent)]">
        {couple.partner1} &amp; {couple.partner2}
      </h1>
      <p className="mt-4 max-w-xs font-serif text-lg text-[var(--color-ink)]">
        {t(greeting.invitedLine, lang, defaultLanguage)}
      </p>
    </div>
  );
}
