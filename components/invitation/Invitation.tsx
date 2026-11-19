"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { themeCssVars } from "@/designs/jardin-blanc/theme";
import { t, uiStrings } from "@/lib/i18n";
import { formatEventDate } from "@/lib/date";
import type { Content, Lang, Section } from "@/lib/content/schema";
import { Cover } from "@/components/sections/Cover";
import { Sections } from "@/components/sections/Sections";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Envelope } from "./Envelope";
import { OpeningVideo } from "./OpeningVideo";
import { MusicController, type MusicControllerHandle } from "./MusicController";

type CoverSection = Extract<Section, { type: "cover" }>;

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
  const {
    couple,
    greeting,
    defaultLanguage,
    languages,
    design,
    music,
    event,
    sections,
  } = content;
  const coverSection = sections.find(
    (section): section is CoverSection => section.type === "cover",
  );

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

  // `<html lang>` and the URL's `?lang=` both need to track the guest's
  // choice, not just the value read from the URL on first load. Plain
  // history.replaceState (rather than next/navigation's useSearchParams)
  // sidesteps that hook's Suspense-boundary requirement for static
  // generation; see docs/DECISIONS.md.
  useEffect(() => {
    document.documentElement.lang = currentLang;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", currentLang);
      window.history.replaceState(null, "", url.toString());
    } catch {
      // ignore
    }
  }, [currentLang]);

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
        {coverSection && (
          <Cover
            lastFrameSrc={lastFrameSrc}
            partner1={couple.partner1}
            partner2={couple.partner2}
            dearLabel={
              greeting.dear
                ? t(greeting.dear, currentLang, defaultLanguage)
                : undefined
            }
            guestNames={greeting.guestNames}
            subtitle={t(coverSection.subtitle, currentLang, defaultLanguage)}
            quote={
              coverSection.quote
                ? t(coverSection.quote, currentLang, defaultLanguage)
                : undefined
            }
            dateLabel={formatEventDate(event.dateTime, currentLang)}
            scrollHintLabel={strings.scroll}
            revealed={phase === "revealed"}
          />
        )}
        <Sections content={content} lang={currentLang} guestLine={guestLine} />
      </main>

      <AnimatePresence>
        {!envelopeHidden && (
          <div
            key="envelope"
            className="fixed inset-y-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2"
          >
            <Envelope
              posterSrc={posterSrc}
              guestLine={guestLine}
              genericGreeting={t(
                greeting.generic,
                currentLang,
                defaultLanguage,
              )}
              dearLabel={
                greeting.dear
                  ? t(greeting.dear, currentLang, defaultLanguage)
                  : undefined
              }
              guestNames={greeting.guestNames}
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
        {phase === "revealed" && (
          <div
            className="pointer-events-auto absolute"
            style={{
              bottom: "max(env(safe-area-inset-bottom), 16px)",
              left: "max(env(safe-area-inset-left), 16px)",
            }}
          >
            <LanguageSwitch
              languages={languages}
              lang={currentLang}
              onChange={setCurrentLang}
              variant="pill"
            />
          </div>
        )}
      </div>
    </div>
  );
}
