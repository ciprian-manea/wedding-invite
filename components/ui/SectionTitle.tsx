import type { ReactNode } from "react";
import { Ornament } from "./Ornament";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Ornament />
      {/* Pinyon Script has no Cyrillic glyphs; falling back to our own
          Cormorant Garamond (which does) keeps Russian headings on-brand
          instead of silently dropping to the OS's default serif. */}
      <h2 className="font-[family-name:var(--font-script),var(--font-serif)] text-[40px] leading-tight text-[var(--color-accent)] sm:text-[48px]">
        {children}
      </h2>
    </div>
  );
}
