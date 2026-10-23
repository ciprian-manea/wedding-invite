# Decisions

Append new decisions at the bottom: date, decision, why. Never rewrite old entries.

- 2026-10-18 · Opening is a pre-rendered video, not CSS/3D. Why: identical look on every phone, cinematic quality, simple code.
- 2026-10-18 · Music runs through Web Audio with a GainNode. Why: iOS ignores `audio.volume`, so fades need Web Audio.
- 2026-10-18 · Guest name is HTML over the poster, not baked into the video. Why: one video serves every guest.
- 2026-10-18 · H.264 MP4 in two sizes, no HEVC-only. Why: HEVC fails on many Android/Chrome devices.
- 2026-10-18 · Content in JSON files validated by Zod, no database in v1. Why: fastest path; the loader is the only thing to swap later.
- 2026-10-18 · Only `motion` for animation. Why: one library, React-friendly, enough for reveals and scroll effects.
