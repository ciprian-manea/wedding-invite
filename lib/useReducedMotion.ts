"use client";

import { useSyncExternalStore } from "react";

// `motion/react`'s own `useReducedMotion()` returns the real browser value
// immediately on the client's first render (not deferred), while the server
// always renders as if motion is not reduced. Any animation `initial`/style
// value derived from it then mismatches between server and client whenever
// the guest's device actually prefers reduced motion — a real hydration
// error, not just a lint nitpick. `useSyncExternalStore` with a `false`
// server snapshot renders identically on the server and the first client
// pass, then updates safely right after hydration. Same pattern already used
// in Invitation.tsx for the same reason (see docs/DECISIONS.md).
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
