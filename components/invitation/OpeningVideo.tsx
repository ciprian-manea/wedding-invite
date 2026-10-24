"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type OpeningVideoProps = {
  src1080: string;
  src720: string;
  posterSrc: string;
  onFirstFrame: () => void;
  onEnded: () => void;
  onError: () => void;
};

export const OpeningVideo = forwardRef<HTMLVideoElement, OpeningVideoProps>(
  function OpeningVideo(
    { src1080, src720, posterSrc, onFirstFrame, onEnded, onError },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLVideoElement | null>(null);
    const [started, setStarted] = useState(false);

    function setRefs(node: HTMLVideoElement | null) {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }

    // Runs before paint, so the browser hasn't meaningfully started fetching the
    // default (1080p) source yet. Swapping the `src` DOM property directly here,
    // rather than through a React-rendered attribute, keeps the server-rendered
    // and first-hydrated markup identical (both always render src1080), so there
    // is no hydration mismatch.
    useLayoutEffect(() => {
      const video = localRef.current;
      if (!video) return;
      const smallScreen = window.innerWidth * window.devicePixelRatio < 1000;
      const chosen = smallScreen ? src720 : src1080;
      if (video.getAttribute("src") !== chosen) {
        video.src = chosen;
        video.load();
      }
    }, [src1080, src720]);

    return (
      <motion.video
        ref={setRefs}
        src={src1080}
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
        data-started={started}
        className="h-full w-full object-cover object-center"
        initial={false}
        animate={{
          opacity: started ? 1 : 0,
          transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        }}
        onPlaying={() => {
          if (!started) {
            setStarted(true);
            onFirstFrame();
          }
        }}
        onEnded={onEnded}
        onError={onError}
      />
    );
  },
);
