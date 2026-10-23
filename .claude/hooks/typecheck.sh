#!/usr/bin/env bash
# Stop hook: before Claude finishes a turn, make sure TypeScript still compiles.
# Exit 2 sends the errors back to Claude so it fixes them; it only blocks once in a row.
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)" = "true" ]; then
  exit 0
fi
[ -f tsconfig.json ] && [ -f node_modules/.bin/tsc ] || exit 0
OUT=$(node_modules/.bin/tsc --noEmit --pretty false 2>&1)
if [ $? -ne 0 ]; then
  echo "TypeScript errors - fix them before finishing:" >&2
  echo "$OUT" | head -40 >&2
  exit 2
fi
exit 0
