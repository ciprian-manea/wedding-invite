import { Reveal } from "@/components/ui/Reveal";
import { t } from "@/lib/i18n";
import type { Lang, Section } from "@/lib/content/schema";

type FooterSection = Extract<Section, { type: "footer" }>;

type FooterProps = {
  section: FooterSection;
  monogram: string;
  lang: Lang;
  defaultLanguage: Lang;
};

export function Footer({
  section,
  monogram,
  lang,
  defaultLanguage,
}: FooterProps) {
  return (
    <Reveal
      rise={false}
      className="flex flex-col items-center gap-3 pb-16 text-center"
    >
      <span className="font-[family-name:var(--font-script)] text-4xl text-[var(--color-accent)]">
        {monogram}
      </span>
      <p className="font-serif text-base text-[var(--color-ink-soft)]">
        {t(section.text, lang, defaultLanguage)}
      </p>
    </Reveal>
  );
}
