#!/usr/bin/env bash
# Join the chosen video takes into the final opening master.
#   bash scripts/assemble-opening.sh jardin-blanc clip1-04.mp4 clip2-07.mp4
# Clip paths can be bare names (looked up in assets-src/<design>/takes/) or full paths.
# Options (environment variables):
#   HOLD_START=1.5    seconds the first frame stays still before motion starts
#   HOLD_END=2        seconds the last frame stays still at the end
#   SPEED=1           below 1 slows the motion (0.85 = 15 % slower)
#   XFADE=0           seconds of crossfade between clips (e.g. 0.3) to hide a small jump at the join
#   VSCALE=           comma-separated extra vertical scale per clip, e.g. "1,0.9909" (see below);
#                      defaults to 1 (no correction) for every clip
# Output: assets-src/<design>/open.mp4 (1080x1920, 24 fps, high quality H.264, no audio)
set -euo pipefail

DESIGN="${1:?usage: assemble-opening.sh <design> <clip> [clip...]}"; shift
[ $# -ge 1 ] || { echo "Give at least one clip" >&2; exit 1; }
SRC="assets-src/$DESIGN"
HOLD_START="${HOLD_START:-1.5}"
HOLD_END="${HOLD_END:-2}"
SPEED="${SPEED:-1}"
XFADE="${XFADE:-0}"
VSCALE="${VSCALE:-}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Normalise every clip: cover-crop to 1080x1920, top-anchored (crop=...:0:0, not ffmpeg's
#    default centered crop) so a take with more excess height to trim loses it off the bottom
#    only, where it's least visible, instead of shifting its ornaments away from BOTH edges.
#    VSCALE then corrects for the two takes' own art not being at quite the same vertical
#    scale to begin with - found by measuring a few shared features (a border line, the bow,
#    a corner ornament) at increasing distance from the top in each take's last/first frame:
#    if the drift between takes grows roughly in proportion to that distance, it's a shared-
#    anchor vertical scale mismatch, not random per-feature noise, and dividing the more
#    "stretched" take's height scale by that ratio (keeping width untouched) corrects it.
#    Re-measure and recompute per clip on every re-shoot; this is calibrated to this footage.
i=0
for c in "$@"; do
  [ -f "$c" ] || c="$SRC/takes/$c"
  [ -f "$c" ] || { echo "Clip not found: $c" >&2; exit 1; }
  V=$(echo "$VSCALE" | cut -d, -f$((i + 1))); [ -z "$V" ] && V=1
  WH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$c")
  S=$(awk -F x -v w="${WH%x*}" -v h="${WH#*x}" 'BEGIN { sw = 1080 / w; sh = 1920 / h; print (sw > sh) ? sw : sh }')
  TW=$(awk -v w="${WH%x*}" -v s="$S" 'BEGIN { print int(w * s * 1.001 / 2 + 0.999) * 2 }')
  TH=$(awk -v h="${WH#*x}" -v s="$S" -v v="$V" 'BEGIN { print int(h * s * v * 1.001 / 2 + 0.999) * 2 }')
  ffmpeg -v error -y -i "$c" -an \
    -vf "setpts=PTS/$SPEED,scale=$TW:$TH,crop=1080:1920:0:0,fps=24,format=yuv420p" \
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
