#!/usr/bin/env bash
# Create simple placeholder media so the opening sequence can be built before the real art exists.
#   bash scripts/make-placeholder-media.sh [design-slug]   (default: jardin-blanc)
# The "envelope" is an ivory panel with a sage seal that slides away to reveal a sage "scene".
# It writes masters to assets-src/<design>/ and then runs encode-media.sh.
set -euo pipefail

DESIGN="${1:-jardin-blanc}"
SRC="assets-src/$DESIGN"
mkdir -p "$SRC"
command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed" >&2; exit 1; }

echo "→ placeholder open.mp4 (8 s, 1080x1920, 24 fps)"
# Scene (what is revealed): sage background with a lighter "arch" block.
# Envelope: ivory panel + darker flap band + square seal; holds 1.5 s, then slides down out of frame by 6 s.
ffmpeg -v error -y \
  -f lavfi -i "color=c=0x9FAF8E:s=1080x1920:r=24:d=8" \
  -f lavfi -i "color=c=0xF7F2E8:s=1080x1920:r=24:d=8" \
  -filter_complex "\
[0]drawbox=x=190:y=360:w=700:h=900:color=0xE9EEDF:t=fill,drawbox=x=240:y=1320:w=600:h=40:color=0xF7F2E8:t=fill[scene];\
[1]drawbox=x=0:y=0:w=1080:h=760:color=0xEDE4D3:t=fill,drawbox=x=470:y=690:w=140:h=140:color=0x7E8F6E:t=fill[env];\
[scene][env]overlay=x=0:y='if(lt(t,1.5),0,min(1920,(t-1.5)/4.5*1920*(t-1.5)/4.5))'[v]" \
  -map "[v]" -c:v libx264 -pix_fmt yuv420p -crf 18 "$SRC/open.mp4"

echo "→ placeholder music.wav (40 s soft chord)"
ffmpeg -v error -y \
  -f lavfi -i "sine=frequency=261.63:duration=40" \
  -f lavfi -i "sine=frequency=329.63:duration=40" \
  -f lavfi -i "sine=frequency=392.00:duration=40" \
  -filter_complex "[0][1][2]amix=inputs=3,volume=0.5,tremolo=f=0.25:d=0.4[a]" \
  -map "[a]" "$SRC/music.wav"

bash "$(dirname "$0")/encode-media.sh" "$DESIGN"
