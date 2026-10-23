#!/usr/bin/env bash
# PostToolUse hook: format the file Claude just edited with Prettier.
# Never blocks: formatting problems are not worth stopping the work for.
FILE_PATH=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$FILE_PATH" ] && exit 0
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) ;;
  *) exit 0 ;;
esac
[ -f node_modules/.bin/prettier ] || exit 0
node_modules/.bin/prettier --write --log-level warn "$FILE_PATH" >/dev/null 2>&1
exit 0
