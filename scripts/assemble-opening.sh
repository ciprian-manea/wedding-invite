#!/usr/bin/env bash
# Join the chosen video takes into the final opening master.
#   bash scripts/assemble-opening.sh jardin-blanc clip1-04.mp4 clip2-07.mp4
# Clip paths can be bare names (looked up in assets-src/<design>/takes/) or full paths.
# Options (environment variables):
#   HOLD_START=1.5    seconds the first frame stays still before motion starts
#   HOLD_END=2        seconds the last frame stays still at the end
#   SPEED=1           below 1 slows the motion (0.85 = 15 % slower)
#   XFADE=0           seconds of crossfade between clips (e.g. 0.3) to hide a small jump at the join
#   CONTENT_W=1080    each clip's content width before fitting to 1080 (lower = visible side
#                      margin, padded in MARGIN_COLOR; 1080 is edge-to-edge, same as the poster)
#   MARGIN_COLOR=...  the pad colour when CONTENT_W < 1080, sampled from the art's own blank
#                      paper (not the page's --color-paper token) so it blends with the pixels
#                      next to it
# Output: assets-src/<design>/open.mp4 (1080x1920, 24 fps, high quality H.264, no audio)
set -euo pipefail

DESIGN="${1:?usage: assemble-opening.sh <design> <clip> [clip...]}"; shift
[ $# -ge 1 ] || { echo "Give at least one clip" >&2; exit 1; }
SRC="assets-src/$DESIGN"
HOLD_START="${HOLD_START:-1.5}"
HOLD_END="${HOLD_END:-2}"
SPEED="${SPEED:-1}"
XFADE="${XFADE:-0}"
CONTENT_W="${CONTENT_W:-1080}"
MARGIN_COLOR="${MARGIN_COLOR:-0xE6E7DF}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Normalise every clip: scale every take to the SAME content width (not a per-clip
#    cover-crop, which zooms each take by whatever its own aspect ratio demands - on takes
#    with slightly different native aspect ratios that crops a different amount off each
#    one, landing the ornaments at a slightly different margin at the clip1/clip2 join),
#    then fit it to 1080x1920. At the default CONTENT_W=1080 that's a centered crop to
#    1920 tall, edge-to-edge like the poster; CONTENT_W < 1080 pads a visible side margin
#    in MARGIN_COLOR instead (only safe if height-at-CONTENT_W stays under 1920).
i=0
for c in "$@"; do
  [ -f "$c" ] || c="$SRC/takes/$c"
  [ -f "$c" ] || { echo "Clip not found: $c" >&2; exit 1; }
  FIT="pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=$MARGIN_COLOR"
  [ "$CONTENT_W" -ge 1080 ] && FIT="crop=1080:1920"
  ffmpeg -v error -y -i "$c" -an \
    -vf "setpts=PTS/$SPEED,scale=$CONTENT_W:-2,$FIT,fps=24,format=yuv420p" \
    -c:v libx264 -crf 14 -preset medium "$TMP/n$i.mp4"
  i=$((i + 1))
done

# 2. Join (plain concat, or crossfade chain)
if [ "$i" -eq 1 ]; then
  cp "$TMP/n0.mp4" "$TMP/joined.mp4"
elif awk -v x="$XFADE" 'BEGIN { exit !(x > 0) }'; then
  INPUTS=(); for ((k = 0; k < i; k++)); do INPUTS+=(-i "$TMP/n$k.mp4"); done
  FILTER=""; PREV="0:v"; OFFSET=0
  for ((k = 1; k < i; k++)); do
    D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/n$((k - 1)).mp4")
    OFFSET=$(awk -v o="$OFFSET" -v d="$D" -v x="$XFADE" 'BEGIN { print o + d - x }')
    FILTER+="[$PREV][$k:v]xfade=transition=fade:duration=$XFADE:offset=$OFFSET[x$k];"
    PREV="x$k"
  done
  ffmpeg -v error -y "${INPUTS[@]}" -filter_complex "${FILTER%;}" -map "[$PREV]" -c:v libx264 -crf 14 -preset medium "$TMP/joined.mp4"
else
  for ((k = 0; k < i; k++)); do echo "file '$TMP/n$k.mp4'" >> "$TMP/list.txt"; done
  ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/joined.mp4"
fi

# 3. Hold first and last frames
mkdir -p "$SRC"
ffmpeg -v error -y -i "$TMP/joined.mp4" \
  -vf "tpad=start_mode=clone:start_duration=$HOLD_START:stop_mode=clone:stop_duration=$HOLD_END,format=yuv420p" \
  -c:v libx264 -crf 16 -preset slow -movflags +faststart "$SRC/open.mp4"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC/open.mp4")
echo "Wrote $SRC/open.mp4 (${DUR}s)"
awk -v d="$DUR" 'BEGIN { if (d < 7.5 || d > 10.5) print "WARNING: target length is 8-10 s; adjust SPEED, HOLD_START or HOLD_END." }'
echo "Next: bash scripts/review-take.sh $SRC/open.mp4, then bash scripts/encode-media.sh $DESIGN"
