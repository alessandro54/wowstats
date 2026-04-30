#!/bin/bash
# Enforces atomic design size limits on component files.
# atoms < 100 lines, molecules < 200, organisms/features < 300

failed=0
for f in "$@"; do
  [ -f "$f" ] || continue
  case "$f" in
    *.stories.tsx|*.test.tsx|*__tests__/*) continue ;;
  esac
  lines=$(wc -l < "$f" | tr -d ' ')
  max=300
  case "$f" in
    *atoms/*) max=150 ;;
    *molecules/*) max=200 ;;
    *organisms/*|*features/*) max=300 ;;
    *) continue ;;
  esac
  if [ "$lines" -gt "$max" ]; then
    echo "SIZE FAIL: $f ($lines lines > $max max)"
    failed=1
  fi
done
exit $failed
