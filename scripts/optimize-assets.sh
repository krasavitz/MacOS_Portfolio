#!/usr/bin/env bash
#
# Optimize portfolio assets before they go in the repo.
#
#   brew install ffmpeg webp
#   ./scripts/optimize-assets.sh ~/Desktop/tchpack-raw public/images/work/tchpack
#
# Reads every image/video in SRC, writes optimized versions to OUT.
# Never writes over the originals — keep those somewhere outside the repo.

set -euo pipefail

SRC="${1:?usage: optimize-assets.sh <source-dir> <output-dir>}"
OUT="${2:?usage: optimize-assets.sh <source-dir> <output-dir>}"

# Max width in px. Portfolio screenshots never need to exceed this.
MAX_W="${MAX_W:-1600}"
# WebP quality. 82 is visually lossless for UI screenshots.
Q="${Q:-82}"
# Video constant rate factor. Higher = smaller. 30 is a good screen-capture default.
CRF="${CRF:-30}"

command -v cwebp >/dev/null || { echo "missing: brew install webp"; exit 1; }
command -v ffmpeg >/dev/null || { echo "missing: brew install ffmpeg"; exit 1; }

mkdir -p "$OUT"

shopt -s nullglob nocaseglob

for f in "$SRC"/*.{png,jpg,jpeg}; do
  name="$(basename "${f%.*}")"
  cwebp -q "$Q" -resize "$MAX_W" 0 -quiet "$f" -o "$OUT/$name.webp"
  printf '%-40s %8s -> %8s\n' "$name.webp" \
    "$(du -h "$f" | cut -f1)" "$(du -h "$OUT/$name.webp" | cut -f1)"
done

for f in "$SRC"/*.{mov,mp4,m4v,webm}; do
  name="$(basename "${f%.*}")"
  # Muted, faststart, capped width, even dimensions (h264 requires it).
  ffmpeg -nostdin -loglevel error -y -i "$f" \
    -an \
    -vf "scale='min($MAX_W,iw)':-2" \
    -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf "$CRF" -preset slow -movflags +faststart \
    "$OUT/$name.mp4"

  # Poster frame, so the window has something to show before the video decodes.
  ffmpeg -nostdin -loglevel error -y -i "$f" \
    -vf "scale='min($MAX_W,iw)':-2" -frames:v 1 "$OUT/$name-poster.webp"

  size=$(du -h "$OUT/$name.mp4" | cut -f1)
  printf '%-40s %8s -> %8s\n' "$name.mp4" "$(du -h "$f" | cut -f1)" "$size"

  bytes=$(wc -c < "$OUT/$name.mp4")
  if [ "$bytes" -gt 3000000 ]; then
    echo "  ^ over 3MB. Host this one off-repo instead of committing it."
  fi
done

echo
echo "Output: $OUT"
echo "Total:  $(du -sh "$OUT" | cut -f1)"
