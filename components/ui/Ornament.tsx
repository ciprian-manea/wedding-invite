type OrnamentProps = {
  className?: string;
};

export function Ornament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 24"
      width="96"
      height="20"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 12H46"
        stroke="var(--color-gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M74 12H116"
        stroke="var(--color-gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 12c-4-6-10-6-10 0 0 6 6 8 10 2 4 6 10 4 10-2 0-6-6-6-10 0Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
