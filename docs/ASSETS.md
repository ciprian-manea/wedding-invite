# Media assets

Masters go in `assets-src/<design>/` (not committed). Encoded files go in `public/media/<design>/`.
Until real art exists, `bash scripts/make-placeholder-media.sh` creates working placeholders so development is never blocked.

## Required masters for a design
| File | Spec |
| --- | --- |
| `open.mov` or `open.mp4` | The opening film. Portrait 1080×1920 (9:16), 24 fps, 8–9 s, no audio needed. First frame = closed envelope with empty space in the middle for the HTML guest name. Last 2 s = still final scene. |
| `music.wav` (or .mp3) | 60–120 s loopable track, licensed for commercial client use. |
| `illustrations/*.png` | Section ornaments and venue drawings, transparent PNG, 2× the display size. |
| `paper-grain.png` | 256×256 seamless tile. |

## Output (made by `scripts/encode-media.sh <design>`)
| File | How |
| --- | --- |
| `open-1080.mp4` | H.264 High, CRF 24, `yuv420p`, `+faststart`, no audio, ≈ 2–3 MB |
| `open-720.mp4` | same at 720×1280, CRF 26, ≈ 1–1.5 MB |
| `poster.jpg` | first frame of `open-1080.mp4`, 1080×1920; serve with `next/image` (it makes AVIF/WebP) and `priority` |
| `last-frame.jpg` | last frame of `open-1080.mp4`, 1080×1920; same handling |
| `music.m4a` | AAC 128 kb/s, normalized to −16 LUFS, 1 s fade in/out at the loop ends |
| `music.mp3` | optional 128 kb/s fallback, made only if ffmpeg has libmp3lame |

Check sizes after encoding; if `open-1080.mp4` > 4 MB, raise CRF by 2 and re-run.

## Making the artwork (outside Claude Code)
The full step-by-step brief with ready prompts is docs/ART_BRIEF.md; `/art next` tells the owner the next step.
Summary:
- **Fast route:** generate the envelope and the floral scene with an image model, clean up and upscale in an editor,
  then make the opening with an image-to-video model using the closed envelope as the first frame and the full
  scene as the last frame. Trim and stabilise in DaVinci Resolve (free). Check each tool's commercial-use terms.
- **Scalable route (later):** model the envelope and seal in Blender once; swap the seal monogram texture and the inner
  artwork per design or per couple, and render with a Python script.
- Leave a calm empty area in the middle of the closed-envelope frame: the guest's name is HTML on top of it.
- Never use frames, art or music from other invitation sites, even as placeholders in the repo.
