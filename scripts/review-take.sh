#!/usr/bin/env bash
# Make a contact sheet (12 frames) of a video take so Claude can look at it, and print its specs.
#   bash scripts/review-take.sh assets-src/jardin-blanc/takes/clip1-03.mp4
# Writes <same folder>/review/<name>-sheet.png and <name>-first.png / <name>-last.png
set -euo pipefail

IN="${1:?usage: review-take.sh <video>}"
[ -f "$IN" ] || { echo "Not found: $IN" >&2; exit 1; }
DIR="$(dirname "$IN")/review"
NAME="$(basename "${IN%.*}")"
mkdir -p "$DIR"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -of compact=p=0 "$IN"
echo "duration=${DUR}s"

# 12 evenly spaced frames, tiled 6x2, each 270 px wide
FPS=$(awk -v d="$DUR" 'BEGIN { printf "%.4f", 12 / d }')
ffmpeg -v error -y -i "$IN" -vf "fps=$FPS,scale=270:-2,tile=6x2:padding=4:color=white" -frames:v 1 "$DIR/$NAME-sheet.png"
ffmpeg -v error -y -i "$IN" -frames:v 1 "$DIR/$NAME-first.png"
ffmpeg -v error -y -sseof -0.5 -i "$IN" -update 1 "$DIR/$NAME-last.png"

echo "sheet=$DIR/$NAME-sheet.png"
echo "first=$DIR/$NAME-first.png"
echo "last=$DIR/$NAME-last.png"
