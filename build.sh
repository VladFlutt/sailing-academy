#!/bin/sh
# Wraps src/app.html (the page body, also published as a claude.ai artifact) into a full index.html for Vercel.
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="favicon.svg"></head><body>\n'
  cat src/app.html
  printf '\n</body></html>\n'
} > index.html
