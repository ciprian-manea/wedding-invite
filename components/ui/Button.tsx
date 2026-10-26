import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const buttonClassName =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] px-6 font-[family-name:var(--font-sans)] text-[13px] uppercase tracking-[0.15em] text-[var(--color-accent)] transition-colors active:bg-[var(--color-accent)]/10";

function joinClassNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClassNames(buttonClassName, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonLink({ className, ...props }: ButtonLinkProps) {
  return (
    <a className={joinClassNames(buttonClassName, className)} {...props} />
  );
}
