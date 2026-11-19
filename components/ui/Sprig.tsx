// Three copies of Ornament's bud motif, scattered and rotated into a loose
// cluster, reused at a larger scale as a very faint background accent
// instead of a divider - same visual language, new job.
const BUD = "M0 0c-4-6-10-6-10 0 0 6 6 8 10 2 4 6 10 4 10-2 0-6-6-6-10 0Z";

type SprigProps = {
  className?: string;
};

export function Sprig({ className }: SprigProps) {
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      >
        <path d={BUD} transform="translate(40 40) rotate(15) scale(1.6)" />
        <path d={BUD} transform="translate(90 68) rotate(-25) scale(1.1)" />
        <path d={BUD} transform="translate(58 100) rotate(60) scale(1.3)" />
      </g>
    </svg>
  );
}
