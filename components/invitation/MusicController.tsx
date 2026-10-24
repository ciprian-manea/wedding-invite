"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type MusicControllerHandle = {
  unlockAndFadeIn: () => void;
};

type MusicControllerProps = {
  src: string;
  visible: boolean;
  muteLabel: string;
  unmuteLabel: string;
};

const FADE_IN_SECONDS = 2.5;
const FADE_TOGGLE_SECONDS = 0.4;
const TARGET_GAIN = 0.6;

type AudioSessionNavigator = Navigator & {
  audioSession?: { type: string };
};

function getAudioContextCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

export const MusicController = forwardRef<
  MusicControllerHandle,
  MusicControllerProps
>(function MusicController({ src, visible, muteLabel, unmuteLabel }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [contextState, setContextState] = useState<AudioContextState | "none">(
    "none",
  );

  useImperativeHandle(ref, () => ({
    unlockAndFadeIn() {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        if (!audioCtxRef.current) {
          const Ctor = getAudioContextCtor();
          if (!Ctor) throw new Error("Web Audio unsupported");
          const ctx = new Ctor();
          const source = ctx.createMediaElementSource(audio);
          const gain = ctx.createGain();
          gain.gain.value = 0;
          source.connect(gain).connect(ctx.destination);
          ctx.addEventListener("statechange", () => setContextState(ctx.state));

          audioCtxRef.current = ctx;
          gainRef.current = gain;
          sourceRef.current = source;
          setContextState(ctx.state);
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => setFailed(true));
        }

        const audioSessionNav = navigator as AudioSessionNavigator;
        if (audioSessionNav.audioSession) {
          try {
            audioSessionNav.audioSession.type = "playback";
          } catch {
            // best effort only
          }
        }

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => setFailed(true));
        }

        const gain = gainRef.current;
        if (gain) {
          const now = ctx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(TARGET_GAIN, now + FADE_IN_SECONDS);
        }
      } catch {
        setFailed(true);
      }
    },
  }));

  function toggleMute() {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    const now = ctx.currentTime;
    const nextMuted = !muted;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(
      nextMuted ? 0 : TARGET_GAIN,
      now + FADE_TOGGLE_SECONDS,
    );
    setMuted(nextMuted);
  }

  useEffect(() => {
    function handleVisibilityChange() {
      const audio = audioRef.current;
      if (!audio || !audioCtxRef.current) return;

      if (document.visibilityState === "hidden") {
        audio.pause();
      } else if (!muted) {
        audio.play().catch(() => setFailed(true));
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [muted]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        className="hidden"
        data-context-state={contextState}
      />
      {visible && !failed && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? unmuteLabel : muteLabel}
          aria-pressed={muted}
          className="pointer-events-auto absolute flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-paper)]/90 text-[var(--color-ink)] shadow-md backdrop-blur"
          style={{
            bottom: "max(env(safe-area-inset-bottom), 16px)",
            right: "max(env(safe-area-inset-right), 16px)",
          }}
        >
          {muted ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="m2.1 3.51 18.39 18.39-1.41 1.41L1.69 4.92z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="M16.5 12a4.5 4.5 0 0 0-1.34-3.2l1.06-1.06A6 6 0 0 1 18 12a6 6 0 0 1-1.78 4.26l-1.06-1.06A4.5 4.5 0 0 0 16.5 12z" />
              <path d="M18.36 5.64A8.97 8.97 0 0 1 21 12a8.97 8.97 0 0 1-2.64 6.36l-1.06-1.06A7.47 7.47 0 0 0 19.5 12a7.47 7.47 0 0 0-2.2-5.3z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
});
