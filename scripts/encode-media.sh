#!/usr/bin/env bash
# Encode a design's masters into web-ready media.
#   bash scripts/encode-media.sh jardin-blanc
# Input:  assets-src/<design>/open.(mov|mp4)  and  assets-src/<design>/music.(wav|mp3|m4a)
# Output: public/media/<design>/open-1080.mp4, open-720.mp4, poster.jpg, last-frame.jpg, music.m4a, music.mp3
# Tune size with CRF_1080 / CRF_720 (higher = smaller file), e.g. CRF_1080=26 bash scripts/encode-media.sh jardin-blanc
set -euo pipefail

DESIGN="${1:?usage: encode-media.sh <design-slug>}"
SRC="assets-src/$DESIGN"
OUT="public/media/$DESIGN"
CRF_1080="${CRF_1080:-24}"
CRF_720="${CRF_720:-26}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe is not installed" >&2; exit 1; }

VIDEO=""
for f in "$SRC/open.mov" "$SRC/open.mp4"; do [ -f "$f" ] && VIDEO="$f" && break; done
[ -n "$VIDEO" ] || { echo "No $SRC/open.mov or open.mp4" >&2; exit 1; }

MUSIC=""
for f in "$SRC/music.wav" "$SRC/music.mp3" "$SRC/music.m4a"; do [ -f "$f" ] && MUSIC="$f" && break; done

mkdir -p "$OUT"
VF_BASE="fps=24,format=yuv420p"

echo "→ open-1080.mp4 (CRF $CRF_1080)"
ffmpeg -v error -y -i "$VIDEO" -an \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,$VF_BASE" \
  -c:v libx264 -profile:v high -preset slow -crf "$CRF_1080" -movflags +faststart \
  "$OUT/open-1080.mp4"

echo "→ open-720.mp4 (CRF $CRF_720)"
ffmpeg -v error -y -i "$OUT/open-1080.mp4" -an \
  -vf "scale=720:1280:flags=lanczos,$VF_BASE" \
  -c:v libx264 -profile:v high -preset slow -crf "$CRF_720" -movflags +faststart \
  "$OUT/open-720.mp4"

# Poster and last frame come from the encoded file, so they match what the guest sees exactly.
echo "→ poster.jpg, last-frame.jpg"
ffmpeg -v error -y -i "$OUT/open-1080.mp4" -frames:v 1 -q:v 2 "$OUT/poster.jpg"
ffmpeg -v error -y -sseof -1 -i "$OUT/open-1080.mp4" -update 1 -q:v 2 "$OUT/last-frame.jpg"

if [ -n "$MUSIC" ]; then
  # The player loops the track (<audio loop>), so we build a seamless loop:
  # 1) cut trailing silence, 2) blend the last LOOP_XFADE seconds over the first ones (equal-power),
  # so the end flows straight into the start with no gap or volume dip. LOOP_XFADE=0 turns it off.
  # The first play starts on that blend, which the player's 2.5 s gain fade-in hides.
  LOOP_XFADE="${LOOP_XFADE:-4}"
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  ffmpeg -v error -y -i "$MUSIC" -vn \
    -af "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse" \
    -c:a pcm_s16le "$TMP/trimmed.wav"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/trimmed.wav")
  NORM="loudnorm=I=-16:TP=-1.5:LRA=11"
  if awk -v d="$DUR" -v c="$LOOP_XFADE" 'BEGIN { exit !(c > 0 && d > 4 * c) }'; then
    TAIL=$(awk -v d="$DUR" -v c="$LOOP_XFADE" 'BEGIN { print d - c }')
    FC="[0:a]asplit=3[a][b][c];"
    FC+="[a]atrim=0:$LOOP_XFADE,asetpts=PTS-STARTPTS,afade=t=in:d=$LOOP_XFADE:curve=qsin[head];"
    FC+="[b]atrim=start=$TAIL,asetpts=PTS-STARTPTS,afade=t=out:d=$LOOP_XFADE:curve=qsin[tail];"
    FC+="[head][tail]amix=inputs=2:normalize=0[joint];"
    FC+="[c]atrim=start=$LOOP_XFADE:end=$TAIL,asetpts=PTS-STARTPTS[body];"
    FC+="[joint][body]concat=n=2:v=0:a=1[out]"
    echo "  loop: ${LOOP_XFADE}s crossfade, track ${DUR}s → $TAIL s"
  else
    FC="[0:a]anull[out]"
    echo "  loop: crossfade off"
  fi
  ffmpeg -v error -y -i "$TMP/trimmed.wav" -filter_complex "$FC" -map "[out]" -ar 48000 \
    -c:a pcm_f32le "$TMP/loop.wav"
  # One fixed gain to −16 LUFS (true peak ≤ −1.5 dB). Not loudnorm's dynamic mode: its gain drifts
  # over the track, so the end and the start would play at different levels and the loop would jump.
  STATS=$(ffmpeg -hide_banner -i "$TMP/loop.wav" -af "$NORM:print_format=summary" -f null - 2>&1)
  IN_I=$(awk '/Input Integrated/ { print $3 }' <<<"$STATS")
  IN_TP=$(awk '/Input True Peak/ { print $4 }' <<<"$STATS")
  GAIN=$(awk -v i="$IN_I" -v tp="$IN_TP" 'BEGIN { g = -16 - i; p = -1.5 - tp; if (p < g) g = p; printf "%.2f", g }')
  echo "  loudness: ${IN_I} LUFS, peak ${IN_TP} dB → gain ${GAIN} dB"
  AF="volume=${GAIN}dB"
  echo "→ music.m4a"
  ffmpeg -v error -y -i "$TMP/loop.wav" -af "$AF" -c:a aac -b:a 128k -movflags +faststart "$OUT/music.m4a"
  if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libmp3lame; then
    echo "→ music.mp3"
    ffmpeg -v error -y -i "$TMP/loop.wav" -af "$AF" -c:a libmp3lame -b:a 128k "$OUT/music.mp3"
  else
    echo "  (skipped music.mp3: this ffmpeg has no libmp3lame; music.m4a works in all current browsers)"
  fi
else
  echo "  (no music master found in $SRC, skipped music)"
fi

echo
echo "Done. Sizes:"
ls -lh "$OUT" | awk 'NR>1 { printf "  %-16s %s\n", $9, $5 }'
SIZE_1080=$(wc -c < "$OUT/open-1080.mp4")
if [ "$SIZE_1080" -gt 4194304 ]; then
  echo "WARNING: open-1080.mp4 is over 4 MB. Re-run with CRF_1080=$((CRF_1080 + 2))." >&2
fi
