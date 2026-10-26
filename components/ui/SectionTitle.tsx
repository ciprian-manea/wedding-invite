import type { ReactNode } from "react";
import { Ornament } from "./Ornament";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Ornament />
      <h2 className="font-[family-name:var(--font-script)] text-[40px] leading-tight text-[var(--color-accent)] sm:text-[48px]">
        {children}
      </h2>
    </div>
  );
}
