"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type CoverProps = {
  lastFrameSrc: string;
  partner1: string;
  partner2: string;
  dearLabel?: string;
  guestNames?: string;
  subtitle: string;
  quote?: string;
  dateLabel: string;
  scrollHintLabel: string;
  revealed: boolean;
};

const PETAL_COUNT = 10;

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  angle: number;
  spin: number;
};

function createPetals(width: number, height: number): Petal[] {
  return Array.from({ length: PETAL_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: 5 + Math.random() * 5,
    speed: 10 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 10,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.2,
  }));
}

function PetalsCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let petals: Petal[] = [];
    let visible = false;
    let frame = 0;
    let lastTime = performance.now();

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? window.innerWidth;
      const height = parent?.clientHeight ?? window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = createPetals(width, height);
    }
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    function tick(time: number) {
      frame = requestAnimationFrame(tick);
      if (!visible || !canvas) {
        lastTime = time;
        return;
      }
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx!.clearRect(0, 0, width, height);
      for (const petal of petals) {
        petal.y += petal.speed * dt;
        petal.x += petal.drift * dt;
        petal.angle += petal.spin * dt;
        if (petal.y > height + 10) {
          petal.y = -10;
          petal.x = Math.random() * width;
        }
        ctx!.save();
        ctx!.translate(petal.x, petal.y);
        ctx!.rotate(petal.angle);
        ctx!.fillStyle = "rgba(201, 209, 188, 0.85)";
        ctx!.beginPath();
        ctx!.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}

export function Cover({
  lastFrameSrc,
  partner1,
  partner2,
  dearLabel,
  guestNames,
  subtitle,
  quote,
  dateLabel,
  scrollHintLabel,
  revealed,
}: CoverProps) {
  const reducedMotion = useReducedMotion();
  const names = `${partner1} & ${partner2}`;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden">
      {/* Stays invisible until revealed: Envelope and OpeningVideo crossfade
          over each other on tap, and for a moment both are partially
          transparent. Without this, that moment lets this very different-
          looking final-frame photo bleed through underneath them. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1 }}
        animate={
          revealed
            ? { opacity: 1, scale: reducedMotion ? 1 : 1.04 }
            : undefined
        }
        transition={{
          opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 12, ease: "linear" },
        }}
      >
        <Image
          src={lastFrameSrc}
          alt=""
          fill
          priority
          sizes="430px"
          className="object-cover object-center"
        />
      </motion.div>

      {!reducedMotion && <PetalsCanvas active={revealed} />}

      <div className="relative z-20 flex w-full flex-col items-center gap-3 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/85 to-transparent px-8 pb-16 pt-40 text-center">
        {/* See SectionTitle.tsx: Pinyon Script has no Cyrillic glyphs. The
            couple's names are the one place this could matter even for the
            default (Latin) demo content, if a real couple's names were
            Cyrillic. */}
        <h1
          aria-label={names}
          className="font-[family-name:var(--font-script),var(--font-serif)] text-5xl text-[var(--color-accent)]"
        >
          {[...names].map((char, index) => (
            <motion.span
              // See the comment in Reveal.tsx: `initial` freezes at mount, so
              // the key must include `reducedMotion` to force a remount once
              // it resolves to its real value.
              key={`${index}-${reducedMotion}`}
              aria-hidden="true"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={revealed ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </h1>
        {guestNames && (
          <div className="flex flex-col items-center gap-1">
            {dearLabel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: 1 } : undefined}
                transition={{
                  delay: 0.5,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-serif text-lg text-[var(--color-ink)]"
              >
                {dearLabel}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 1 } : undefined}
              transition={{
                delay: 0.58,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-[family-name:var(--font-script),var(--font-serif)] text-2xl text-[var(--color-accent)]"
            >
              {guestNames}
            </motion.p>
          </div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-lg text-[var(--color-ink)]"
        >
          {subtitle}
        </motion.p>
        {quote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : undefined}
            transition={{
              delay: 0.8,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-base text-[var(--color-ink-soft)] italic"
          >
            {quote}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ delay: 0.95, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-xs tracking-[0.2em] text-[var(--color-ink-soft)] uppercase"
        >
          {dateLabel}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ delay: 1.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-sans text-xs tracking-[0.2em] text-[var(--color-ink-soft)] uppercase"
        >
          {scrollHintLabel}
        </motion.p>
      </div>
    </div>
  );
}
