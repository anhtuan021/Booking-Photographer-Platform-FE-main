#!/usr/bin/env bash
# Copy theme files from provided path into public/theme
# Usage: ./scripts/import-theme.sh /path/to/template

set -e
SRC="$1"
DEST="$(pwd)/public/theme"

if [ -z "$SRC" ]; then
  echo "Usage: $0 /path/to/theme/template"
  exit 2
fi

if [ ! -d "$SRC" ]; then
  echo "Source path does not exist: $SRC"
  exit 3
fi

mkdir -p "$DEST"
rsync -av --exclude '*.html' "$SRC/" "$DEST/"
# copy root html files too
rsync -av "$SRC/*.html" "$DEST/" || true

echo "Theme imported to $DEST"
