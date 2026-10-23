---
name: encode-media
description: Encode a design's master video and music from assets-src/<design>/ into web-ready files in public/media/<design>/, and verify them. Use when new or changed media masters are added.
argument-hint: [design slug, e.g. jardin-blanc]
---

Encode media for the design "$ARGUMENTS".

1. Check `ffmpeg` and `ffprobe` are installed (`ffmpeg -version`). If not, tell the user how to install them and stop.
2. List `assets-src/$ARGUMENTS/`. It needs `open.mov` or `open.mp4`, and `music.wav` or `music.mp3`.
3. Run `bash scripts/encode-media.sh $ARGUMENTS`.
4. Verify with ffprobe: both MP4s are H.264, yuv420p, portrait, 24 fps, no audio stream, `+faststart`
   (the `moov` atom comes before `mdat`). Report each file's size against the targets in docs/ASSETS.md.
5. If `open-1080.mp4` is over 4 MB, re-run with `CRF_1080=26`, and so on.
6. Open the poster and the last frame with the Read tool and confirm they look like the video's first and last frames.
7. Check `/demo` with the Playwright MCP: tap, wait for the end, screenshot, and confirm there is no visible jump.
