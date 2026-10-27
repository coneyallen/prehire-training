#!/usr/bin/env bash
# Downloads the images used by the prototype from the Figma file into public/assets.
# Figma's asset links expire about 7 days after they were generated (2026-10-20).
# If they have expired, re-export the images from Figma under the same file names.
set -euo pipefail
cd "$(dirname "$0")/../public/assets"

LOGIN=https://www.figma.com/api/mcp/asset/7a9d9dce-4c94-4259-b73e-86face601800
LANG=https://www.figma.com/api/mcp/asset/d4b61f28-e911-47a7-9d19-666876e31f2a
LIST=https://www.figma.com/api/mcp/asset/a999e225-2da8-43a0-a8d9-c6c921d10884
VIDEO=https://www.figma.com/api/mcp/asset/b6ef83f5-183c-4abf-a4e8-6b0bdda10821

get() { curl -fsSL -o "$2" "$1" && echo "ok   $2" || echo "FAIL $2"; }

# Login screen
get "$LOGIN/5d9d0.svg" sbm-logo.svg
get "$LOGIN/608d1.png" team.png
get "$LOGIN/c4efe.svg" brand-shape.svg

# Header / shared
get "$LANG/9a253.svg" 4insite-logo-word.svg
get "$LANG/529ad.svg" 4insite-logo-dot.svg
get "$LANG/d5c92.svg" 4insite-logo-mark.svg
get "$LANG/f37fe.svg" translate.svg

# Course list
get "$LIST/82f75.png" skill-custodian.png
get "$LIST/f04d9.png" skill-safety.png
get "$LIST/fcb60.svg" banner-shape.svg
get "$LIST/0b20f.png" thumb-incident-reporting.png
get "$LIST/a1f96.png" thumb-daily-cleaning-logs.png
get "$LIST/c2961.png" thumb-disinfectant-cleaning.png
get "$LIST/28f81.png" thumb-active-shooter.png
get "$LIST/6144d.png" thumb-stairway-safety.png
get "$LIST/0e75e.png" thumb-good-catch.png
get "$LIST/964af.png" thumb-high-traffic.png
get "$LIST/19338.png" thumb-payroll.png
get "$LIST/00e92.png" thumb-eye-protection.png
get "$LIST/461ea.png" thumb-hand-protection.png
get "https://www.figma.com/api/mcp/asset/8742b988-f0d4-4bc9-8601-88f4275cc5b1/17a89.svg" hero-shape.svg
