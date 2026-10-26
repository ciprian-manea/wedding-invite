"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { t } from "@/lib/i18n";
import { formatEventDate } from "@/lib/date";
import type { Lang, Section } from "@/lib/content/schema";

type ScratchRevealSection = Extract<Section, { type: "scratchReveal" }>;

type ScratchRevealProps = {
  section: ScratchRevealSection;
  eventDateTime: string;
  lang: Lang;
  defaultLanguage: Lang;
};

const CLEAR_THRESHOLD = 0.55;
const CHECK_INTERVAL_MS = 200;
const BRUSH_RADIUS = 22;
// Sampling every pixel's alpha each check is unnecessary for a percentage
// estimate; this stride keeps the cost trivial on a card-sized canvas.
const SAMPLE_STRIDE = 16;

export function ScratchReveal({
  section,
  eventDateTime,
  lang,
  defaultLanguage,
}: ScratchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  // The scratch-canvas effect below only runs once (on mount) so it can't
  // close over a reactive `reducedMotion`; this ref gives it the current
  // value at whatever later moment the guest actually finishes scratching.
  const reducedMotionRef = useRef(reducedMotion);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const dateLabel = formatEventDate(eventDateTime, lang);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    function paintCover() {
      if (!canvas || !container || !ctx) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      // The container can briefly report zero size (e.g. before layout
      // settles); skip rather than produce a zero-size canvas that
      // `getImageData` later throws on.
      if (width === 0 || height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const cover = getComputedStyle(container)
        .getPropertyValue("--color-paper-deep")
        .trim();
      ctx.fillStyle = cover || "#EDE4D3";
      ctx.fillRect(0, 0, width, height);
    }
    // A ResizeObserver fires once immediately with the container's current
    // size (whenever layout has actually settled) and again on every later
    // resize — more reliable than reading clientWidth once plus a window
    // "resize" listener, which misses layout changes not tied to the window
    // itself and raced with layout on the very first paint.
    const resizeObserver = new ResizeObserver(paintCover);
    resizeObserver.observe(container);

    function checkCleared() {
      if (revealedRef.current || !canvas || !ctx) return;
      if (canvas.width === 0 || canvas.height === 0) return;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let sampled = 0;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4 * SAMPLE_STRIDE) {
        sampled++;
        if (data[i] === 0) transparent++;
      }
      if (sampled > 0 && transparent / sampled >= CLEAR_THRESHOLD) {
        complete();
      }
    }
    const interval = window.setInterval(checkCleared, CHECK_INTERVAL_MS);

    function complete() {
      if (revealedRef.current) return;
      revealedRef.current = true;
      window.clearInterval(interval);
      setRevealed(true);
      if (!reducedMotionRef.current && container) {
        const styles = getComputedStyle(container);
        const colors = [
          styles.getPropertyValue("--color-accent").trim(),
          styles.getPropertyValue("--color-gold").trim(),
          styles.getPropertyValue("--color-accent-soft").trim(),
        ].filter(Boolean);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors.length > 0 ? colors : undefined,
        });
      }
    }

    return () => {
      resizeObserver.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  function erase(x: number, y: number) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  function getPos(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (revealedRef.current) return;
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = getPos(event);
    erase(x, y);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || revealedRef.current) return;
    const { x, y } = getPos(event);
    erase(x, y);
  }

  function handlePointerUp() {
    drawingRef.current = false;
  }

  return (
    <Reveal className="flex flex-col items-center gap-6 text-center">
      <SectionTitle>{t(section.title, lang, defaultLanguage)}</SectionTitle>
      <div
        ref={containerRef}
        className="relative mx-auto h-48 w-full max-w-xs overflow-hidden rounded-[var(--radius-card)] shadow-md"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-paper)]">
          <p className="font-[family-name:var(--font-script)] text-4xl text-[var(--color-accent)]">
            {dateLabel}
          </p>
        </div>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ pointerEvents: revealed ? "none" : "auto" }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="h-full w-full touch-none"
          />
        </motion.div>
        {!revealed && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 font-sans text-xs tracking-[0.15em] text-[var(--color-ink-soft)] uppercase">
            {t(section.hint, lang, defaultLanguage)}
          </p>
        )}
      </div>
    </Reveal>
  );
}
