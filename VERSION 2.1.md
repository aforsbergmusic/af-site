<!-- =========================================================
     FILE: VERSION 2.1.md
     ========================================================= -->
# VERSION 2.1 — Pause Mode + Jewel Randomization

**Date:** 2025-12-28  
**Status:** Live site temporarily routed to `splash.html` via `index.html`.

## Changes
- `index.html` now redirects to `splash.html` (splash “pause mode”).
- Random jewel tone system remains in `app.js` + `styles.css`:
  - Hover events randomize `--jt` (rich jewel palette).
  - Waveform “played” color uses current `--jt`.
  - Solid fill hover styling (no neon glow, no pastel).

## Quick switch back to main site
- In `index.html`, change:
  - `content="0; url=splash.html"` → `content="0; url=site.html"`
