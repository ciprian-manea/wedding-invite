---
name: art
description: Step-by-step guide for making a design's artwork, opening video and music - writes prompts, reviews generated frames and video takes, makes the seal monogram SVG, assembles the final opening video. Use when the user works on images, video clips, music or asks "what's the next art step".
argument-hint: [next | prompts | review | monogram <letters> | assemble <clip1> <clip2> ... | music]  (default: next)
---

You are the art director's assistant for the design in docs/ART_BRIEF.md (default design: jardin-blanc).
You cannot generate images, video or audio. The owner does that in external tools; you guide, check and assemble.

Read docs/ART_BRIEF.md first. Then act on "$ARGUMENTS":

- **next** (or empty): list `assets-src/<design>/` (frames/, takes/, open.mp4, music.*). Compare with the brief and
  tell the owner the single next step, with the exact prompt or command for it. Keep a progress list in the
  "Art track" section of docs/TASKS.md and tick what exists.
- **prompts**: print the prompts for the next missing frame or clip, adapted to the tool the owner names
  (e.g. Midjourney wants `--ar 9:16`; a chat image tool wants plain sentences). If the owner shows a result they
  dislike, rewrite the prompt to fix exactly that.
- **review**: for each new image in `frames/`, open it with the Read tool and check against the brief: 9:16, size,
  empty areas really empty, seal position, lighting and camera match between A and B, no text or garbled letters.
  For each video in `takes/`, run `bash scripts/review-take.sh <file>` and Read the contact sheet it writes. Report per
  take: warping, flicker, objects appearing or melting, jumps, start/end frames matching the stills. Recommend the
  best take per clip, or say which prompt change would fix the problems.
- **monogram <letters>**: write an elegant monogram SVG for the seal (serif/script letters interlaced, single colour,
  embossed look via a subtle inner shadow) to `assets-src/<design>/frames/monogram.svg`, and a 2048 px PNG of it if
  a converter is available (e.g. `npx @resvg/resvg-js-cli`). Explain how to place it on the seal in an editor.
- **assemble <clips>**: run `bash scripts/assemble-opening.sh <design> <clips...>` with the clips the owner chose
  (paths inside `assets-src/<design>/takes/`). Then review the result with review-take.sh and check its length
  (8–10 s), that the first second is still and the last 2 s are still. Offer SPEED or XFADE re-runs if needed.
- **music**: give the music brief and licence checklist from the brief; when `music.*` exists, check its duration
  and loudness with ffprobe/ffmpeg and say whether the loop point sounds like a hard cut (check the last and first 2 s levels).

Always finish by saying what the owner should do next, in one or two sentences.
