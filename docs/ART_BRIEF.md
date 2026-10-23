# Art brief: Jardin Blanc

How to make the artwork, the opening video and the music, step by step.
The owner makes images, video and music in external tools; Claude Code writes prompts,
reviews every take, assembles the final video and encodes it (`/art` walks through this).

## The concept (original)
A thick ivory envelope sealed with a sage-green wax seal. The seal opens, the flap lifts,
and an ivory card rises out of the envelope toward the camera until its illustration fills the
screen: **a sunlit glass orangery** full of white hydrangeas and peonies, olive trees in terracotta
pots, a gravel path to an open iron door, hanging lanterns, soft morning light.
Do not reuse the composition of any existing invitation (rose arches, curtains, bows, balustrades).

## Palette and look
Ivory `#F7F2E8`, warm paper `#EDE4D3`, sage `#7E8F6E`, pale sage `#C9D1BC`, muted gold `#B89B6A`.
Soft diffused daylight from the upper left, gentle shadows, fine paper texture, calm and airy, never saturated.

## Frames to generate (images)
All vertical 9:16, at least 1080×1920 (generate larger, then upscale). Same camera height, lens and light in all frames.

| Frame | File | What it shows |
| --- | --- | --- |
| A · closed | `frames/A-closed.png` | The whole screen is the envelope, seen from the front, slightly from above. Seal at the tip of the top flap, in the upper third. Large calm empty paper area in the middle and lower half (the guest's name goes there in HTML). |
| B · flap open | `frames/B-open.png` | Same envelope, same camera, flap folded back, the top edge of an ivory card visible inside. |
| C · final scene | `frames/C-scene.png` | The orangery illustration filling the whole screen, with a soft calm area in the upper third for the couple's names. |

### Prompt for A (adapt to your tool)
> Vertical 9:16 photograph of a closed luxury wedding envelope filling the entire frame, front view from slightly above. Thick ivory cotton paper with a subtle embossed botanical pattern and soft deckled edges. A round sage-green wax seal at the tip of the top flap, in the upper third, plain with no letters. Soft diffused daylight from the upper left, gentle natural shadows. Large calm empty paper area in the center and lower half. Muted ivory and sage palette, photorealistic, fine paper texture, no text, no hands, no props.

### Prompt for B
> The same envelope, same camera, same light: the wax seal is broken and the top flap is folded back open, showing the top edge of a thick ivory card inside the envelope. Everything else identical to the previous image. Vertical 9:16, photorealistic, no text.

(Use your tool's "image reference" or "edit" feature with A as the reference, so B matches A.)

### Prompt for C
> Vertical 9:16 dreamy romantic illustration, a mix of soft watercolor and light photographic detail: a sunlit glass orangery with a white iron frame, filled with white hydrangeas and peonies, olive trees in terracotta pots, a pale gravel path leading to an open iron door, glass lanterns hanging from the ceiling, soft morning mist and warm light. Symmetrical, centered composition. A soft, calm, slightly brighter area in the upper third. Ivory, sage and pale gold palette, airy and light. No text, no people.

### After generating
1. Pick the best A, then make B from A (reference/edit mode) so they match.
2. Upscale to at least 1080×1920 (the tool's upscaler, or a dedicated one).
3. Retouch in Photoshop, Affinity or Photopea (free): clean the seal, fix odd petals, keep the empty areas empty.
4. **Seal monogram:** AI tools garble letters. Ask Claude Code for the couple's monogram as an SVG
   (`/art monogram A&I`), then place it on the seal in your editor, slightly embossed.
5. Save into `assets-src/jardin-blanc/frames/` and run `/art review` so Claude checks the frames match.

## Video clips (image-to-video)
Use a tool with **start frame + end frame** (keyframe) mode. Kling, Runway, Luma and Google Veo had it at the time
of writing; check what's current. Settings: 9:16, 1080p if available, 5 s per clip, the highest quality mode.

| Clip | Start → end | Prompt |
| --- | --- | --- |
| 1 · open | A → B | The wax seal gently breaks and the top flap of the envelope slowly lifts and folds back, revealing the top of the ivory card inside. Static camera, realistic paper physics, slow, smooth and elegant. No new objects, no text, no hands. |
| 2 · reveal | B → C | The ivory card rises smoothly out of the envelope toward the camera until its illustrated orangery fills the whole frame. Slow gentle push-in, soft light, smooth continuous motion. No text, no hands. |

Make 6–10 takes of each clip. Save them as `assets-src/jardin-blanc/takes/clip1-01.mp4`, `clip1-02.mp4`, …,
`clip2-01.mp4`, … and run `/art review`. Claude makes a contact sheet of each take and points out warping,
flicker, morphing letters and jumps, then recommends the best take of each clip.

If one tool can't do clip 2 well, a hard cut is not acceptable: try a different tool or a simpler move
(the camera pushes into the card) rather than accepting a jump.

## Assembling the opening (Claude Code, no video editor needed)
`/art assemble clip1-04.mp4 clip2-07.mp4` runs `scripts/assemble-opening.sh`, which:
1. scales and crops every clip to 1080×1920, 24 fps;
2. joins them;
3. holds the first frame for 1.5 s and the last frame for 2 s (the hand-off frames);
4. writes `assets-src/jardin-blanc/open.mp4` and reports its length (target 8–10 s).

Two 5 s clips plus the holds come to about 13.5 s, which is too long: use `SPEED=1.3` to speed the motion up
(or `SPEED=0.85` to slow a single short clip), and `HOLD_START` / `HOLD_END` to adjust the still parts. Add a short crossfade between clips with `XFADE=0.3`
if the join shows a small jump. For finer timing (speed ramps, colour matching), use DaVinci Resolve (free)
and export 1080×1920, 24 fps, high quality, then save the result as `open.mp4` yourself.

## Music
- **Brief:** gentle piano with soft strings, 70–80 BPM, warm and romantic, no vocals, 60–120 s, loopable
  (ends on a phrase that can return to the start).
- **Sources:** a stock music library or a paid AI music plan, or a composer.
- **Licence checklist:** use in client projects you sell is allowed; web/app use allowed; no attribution
  required, or you show the credit in the footer; keep the licence PDF in `assets-src/jardin-blanc/licences/`.
- Save as `assets-src/jardin-blanc/music.wav` (or .mp3).

## Finish
`/encode-media jardin-blanc` (or `/milestone 5`): encodes everything, extracts the poster and last frame,
and checks the hand-off on the simulated iPhone.
