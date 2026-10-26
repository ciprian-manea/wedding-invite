import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

// `scroll-mb` reserves clearance under the fixed mute/language-switch chrome
// (see Invitation.tsx) so that scrolling a button into view - whether via
// `scrollIntoView`, anchor navigation, or a mobile browser auto-scrolling a
// focused field above its keyboard - never lands it flush with the bottom
// edge, where the fixed chrome would otherwise sit on top of it and steal
// the tap. Regular manual scrolling can still pass a button through that
// band momentarily, but it won't come to rest there.
const buttonClassName =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--color-accent)] px-6 font-[family-name:var(--font-sans)] text-[13px] uppercase tracking-[0.15em] text-[var(--color-accent)] transition-colors active:bg-[var(--color-accent)]/10 scroll-mb-[calc(env(safe-area-inset-bottom)+76px)]";

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
