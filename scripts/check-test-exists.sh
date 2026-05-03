#!/bin/bash
# Ensures molecules and organisms have a colocated test file.
# Pattern: <dir>/foo.tsx → <dir>/__tests__/foo.test.tsx
# Pattern: <dir>/foo/index.tsx → <dir>/__tests__/foo.test.tsx

failed=0
for f in "$@"; do
  [ -f "$f" ] || continue
  case "$f" in
    *molecules/*|*organisms/*|*features/*/components/*) ;;
    *) continue ;;
  esac
  case "$f" in
    *__tests__/*|*.test.tsx|*.stories.tsx) continue ;;
    *-helpers.tsx|*-utils.tsx|*-config.tsx|*-types.tsx) continue ;;
  esac

  base=$(basename "$f" .tsx)
  dir=$(dirname "$f")

  # Handle dir/index.tsx → __tests__/<dir-basename>.test.tsx
  if [ "$base" = "index" ]; then
    parent_base=$(basename "$dir")
    parent_dir=$(dirname "$dir")
    test_file="$parent_dir/__tests__/${parent_base}.test.tsx"
  else
    test_file="$dir/__tests__/${base}.test.tsx"
  fi

  if [ ! -f "$test_file" ]; then
    echo "TEST MISSING: $f → expected $test_file"
    failed=1
  fi
done
exit $failed
