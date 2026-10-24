"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { themeCssVars } from "@/designs/jardin-blanc/theme";
import { t, uiStrings } from "@/lib/i18n";
import type { Content, Lang } from "@/lib/content/schema";
import { Envelope } from "./Envelope";
import { OpeningVideo } from "./OpeningVideo";
import { MusicController, type MusicControllerHandle } from "./MusicController";

type InvitationProps = {
  content: Content;
  lang: Lang;
  guestLine?: string;
};

type Phase = "idle" | "loading" | "opening" | "revealed";

const REVEALED_KEY = "invitation:revealed";
const SKIP_DELAY_MS = 1500;
const ENDED_FALLBACK_MS = 10000;
const SLOW_NETWORK_TIMEOUT_MS = 4000;

function subscribeToRevealedStorage() {
  return () => {};
}

function getRevealedFromStorage() {
  try {
    return sessionStorage.getItem(REVEALED_KEY) === "1";
  } catch {
    return false;
  }
}

function getRevealedServerSnapshot() {
  return false;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function waitForReady(
  video: HTMLVideoElement,
  timeoutMs: number,
): Promise<boolean> {
  if (video.readyState >= 3) return Promise.resolve(true);

  return new Promise((resolve) => {
    let done = false;

    function finish(result: boolean) {
      if (done) return;
      done = true;
      video.removeEventListener("canplay", onReady);
      window.clearTimeout(timer);
      resolve(result);
    }

    function onReady() {
      finish(true);
    }

    const timer = window.setTimeout(() => finish(false), timeoutMs);
    video.addEventListener("canplay", onReady);
  });
}

export function Invitation({ content, lang, guestLine }: InvitationProps) {
  const { couple, greeting, defaultLanguage, languages, design, music } =
    content;

  const [currentLang, setCurrentLang] = useState(lang);
  const [machinePhase, setPhase] = useState<Phase>("idle");
  const [videoStarted, setVideoStarted] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);

  // If the guest already opened the envelope earlier in this tab (e.g. came back
  // via the browser's back button), resume straight to "revealed".
  const revealedFromStorage = useSyncExternalStore(
    subscribeToRevealedStorage,
    getRevealedFromStorage,
    getRevealedServerSnapshot,
  );
  const phase: Phase = revealedFromStorage ? "revealed" : machinePhase;

  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<MusicControllerHandle>(null);
  const timersRef = useRef<{ skip?: number; endedFallback?: number }>({});

  // Consistent "false" on the server and on the first client render (avoiding a
  // hydration mismatch); updates to the real value right after hydration.
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const strings = uiStrings[currentLang];

  const posterSrc = `/media/${design}/poster.jpg`;
  const lastFrameSrc = `/media/${design}/last-frame.jpg`;
  const src1080 = `/media/${design}/open-1080.mp4`;
  const src720 = `/media/${design}/open-720.mp4`;

  useEffect(() => {
    if (machinePhase !== "revealed") return;
    try {
      sessionStorage.setItem(REVEALED_KEY, "1");
    } catch {
      // ignore
    }
  }, [machinePhase]);

  useEffect(() => {
    document.body.style.overflow = phase === "revealed" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(
        (id) => id && window.clearTimeout(id),
      );
    };
  }, []);

  function clearTimers() {
    Object.values(timersRef.current).forEach(
      (id) => id && window.clearTimeout(id),
    );
    timersRef.current = {};
  }

  function finishOpening() {
    clearTimers();
    setPhase("revealed");
  }

  async function handleOpen() {
    if (phase !== "idle") return;

    // Must run synchronously inside the gesture: iOS only allows sound during
    // the synchronous part of a user gesture.
    musicRef.current?.unlockAndFadeIn();

    if (reducedMotion) {
      setPhase("revealed");
      return;
    }

    const video = videoRef.current;
    if (video && video.readyState < 3) {
      setPhase("loading");
      const ready = await waitForReady(video, SLOW_NETWORK_TIMEOUT_MS);
      if (!ready) {
        setPhase("revealed");
        return;
      }
    }

    setPhase("opening");
    timersRef.current.skip = window.setTimeout(
      () => setSkipVisible(true),
      SKIP_DELAY_MS,
    );

    try {
      await videoRef.current?.play();
    } catch {
      setPhase("revealed");
    }
  }

  function handleVideoFirstFrame() {
    setVideoStarted(true);
    timersRef.current.endedFallback = window.setTimeout(
      finishOpening,
      ENDED_FALLBACK_MS,
    );
  }

  const envelopeHidden = videoStarted || phase === "revealed";

  return (
    <div
      data-phase={phase}
      style={themeCssVars as React.CSSProperties}
      className="relative min-h-screen bg-[var(--color-paper-deep)]"
    >
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[var(--color-paper)]">
        <div className="relative flex min-h-screen flex-col items-center justify-end">
          <Image
            src={lastFrameSrc}
            alt=""
            fill
            sizes="430px"
            className="object-cover object-center"
          />
          <div className="relative z-10 flex w-full flex-col items-center gap-3 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/85 to-transparent px-8 pb-16 pt-40 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={phase === "revealed" ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-script)] text-5xl text-[var(--color-accent)]"
            >
              {couple.partner1} &amp; {couple.partner2}
            </motion.h1>
            <p className="font-serif text-lg text-[var(--color-ink)]">
              {t(greeting.invitedLine, currentLang, defaultLanguage)}
            </p>
            {phase === "revealed" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
              >
                {strings.scroll}
              </motion.p>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {!envelopeHidden && (
          <div
            key="envelope"
            className="fixed inset-y-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2"
          >
            <Envelope
              posterSrc={posterSrc}
              guestLine={
                guestLine ?? t(greeting.generic, currentLang, defaultLanguage)
              }
              invitedLine={t(
                greeting.invitedLine,
                currentLang,
                defaultLanguage,
              )}
              tapToOpenLabel={t(
                greeting.tapToOpen,
                currentLang,
                defaultLanguage,
              )}
              loadingLabel={strings.loading}
              loading={phase === "loading"}
              languages={languages}
              lang={currentLang}
              onLangChange={setCurrentLang}
              onTap={handleOpen}
              fadeDurationMs={reducedMotion ? 400 : 250}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== "revealed" && !reducedMotion && (
          <div
            key="video"
            className="fixed inset-y-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2"
          >
            <OpeningVideo
              ref={videoRef}
              src1080={src1080}
              src720={src720}
              posterSrc={posterSrc}
              onFirstFrame={handleVideoFirstFrame}
              onEnded={finishOpening}
              onError={finishOpening}
            />
          </div>
        )}
      </AnimatePresence>

      {phase === "opening" && skipVisible && (
        <div className="pointer-events-none fixed inset-y-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={finishOpening}
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 rounded-full border border-[var(--color-paper)]/60 px-5 py-2 font-sans text-xs uppercase tracking-[0.15em] text-[var(--color-paper)]"
            style={{ bottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            {strings.skip}
          </motion.button>
        </div>
      )}

      <div className="pointer-events-none fixed inset-y-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2">
        <MusicController
          ref={musicRef}
          src={music.src}
          visible={phase !== "idle"}
          muteLabel={strings.mute}
          unmuteLabel={strings.unmute}
        />
      </div>
    </div>
  );
}
