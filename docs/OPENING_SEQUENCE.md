# Opening sequence (the core feature)

## What the guest experiences
1. Page loads: a full-screen closed envelope (still image). On it, as real HTML text:
   the guest line ("Dragă Vasile și Ana"), a line like "you are invited", and a softly pulsing
   "Atinge pentru a deschide" / "Нажмите, чтобы открыть" / "Tap to open". Small language switch at the top.
2. Guest taps anywhere on the envelope.
3. The overlay text fades out in 250 ms while the video starts. The flap lifts, the seal goes with it,
   the envelope slides down and reveals the illustrated cover scene (about 8–9 s).
4. Music fades in from silence over 2.5 s, starting with the tap.
5. When the video ends on its last frame, the page underneath (whose hero background IS that last frame)
   is already in place; the video layer fades out in 300 ms. No jump, no flash.
6. The cover names animate in, scrolling unlocks, a small "scroll" hint appears.

## Layers (stacked, all position: fixed until revealed)
| z | Layer | Contents |
| --- | --- | --- |
| 30 | Envelope | `poster` image (object-fit: cover) + HTML overlay |
| 20 | Video | `<video muted playsInline preload="auto">`, hidden (opacity 0) until playing |
| 10 | Page | the invitation; hero background = `last-frame` image |

## State machine (in `Invitation.tsx`)
```text
idle ──tap──▶ opening ──video ended / 10 s timeout / error──▶ revealed
  └──────────── prefers-reduced-motion: tap ─────────────────▶ revealed (fade 400 ms)
opening ──"Skip" button (appears after 1.5 s)──▶ revealed
```
- `idle`: body scroll locked, video preloading.
- `opening`: video visible; envelope fades out once the video reports its first frame
  (`playing` event or `requestVideoFrameCallback`), never before, so there is no black flash.
- `revealed`: video fades out and unmounts, scroll unlocked, sections start their in-view animations.

## The tap handler (must run synchronously inside the gesture)
```ts
async function handleOpen() {
  music.unlockAndFadeIn();        // creates/resumes AudioContext and calls audio.play() in the gesture
  setPhase("opening");
  try { await video.play(); }     // muted video: always allowed, but still handle rejection
  catch { setPhase("revealed"); } // if the video can't play, show the page
}
```
Do not `await` anything before calling `audio.play()` and `video.play()`: iOS only allows sound
during the synchronous part of the user gesture.

## Video rules
- Pick the source by screen: `open-720.mp4` if `window.innerWidth * devicePixelRatio < 1000`, else `open-1080.mp4`.
- H.264 MP4 with `+faststart` (see docs/ASSETS.md). Never ship HEVC only: many Android/Chrome devices can't play it.
- Video is muted; it has no audio track at all.
- `object-fit: cover` and `object-position: center` on video, poster and last frame, so all three crop identically on every screen.
- Poster image = exactly the video's first frame; last-frame image = exactly its last frame (extracted by the encode script).
- Fallback timer: if `ended` hasn't fired 10 s after `playing`, go to `revealed`.

## Music rules (`MusicController.tsx`)
- One `<audio src="music.m4a" loop preload="auto">` element routed through the Web Audio API:
  `MediaElementAudioSourceNode → GainNode → destination`. iOS ignores `audio.volume`, so fades must use the GainNode.
- Fade in: gain 0 → 0.6 over 2.5 s (`linearRampToValueAtTime`). Fade out/in on mute: 400 ms.
- Where supported, set `navigator.audioSession.type = "playback"` (Safari) so music plays even when the iPhone is on silent.
- Floating round mute button (bottom-right, 44×44 px min tap area, safe-area aware), shown from `opening` on.
- Pause on `document.visibilityState === "hidden"`, resume on return if the guest hadn't muted.
- If audio fails, the invitation still works; the mute button just hides.

## Edge cases to handle
- In-app browsers (WhatsApp, Instagram, Facebook): test them; they follow the same gesture rules.
- iOS Low Power Mode: muted video still plays from a tap.
- Very slow network: if the video isn't ready (`readyState < 3`) at tap time, show a small loader over the envelope
  for up to 4 s, then go straight to `revealed`.
- Landscape phone / desktop: center a 430 px wide portrait "phone column" with the paper texture around it.
- Back button after opening: stays revealed (store phase in sessionStorage, wrapped in try/catch).

## Timing reference
For pacing only (do not copy any visuals): a good opening is 8–9 s at 24 fps, with the closed envelope still for
~1.5 s, the flap open by ~3 s, the scene revealed by ~6 s and a 2–3 s hold on the final frame.
