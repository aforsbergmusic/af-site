// =======================================================
// Helpers
// =======================================================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// =======================================================
// Config
// =======================================================
const PROFILE_IMG_URL = ""; // <-- paste headshot URL between quotes

// =======================================================
// Waveform — Style A (Reelcrafter-adjacent)
// =======================================================
function drawWave(canvas, peaks, progress01) {
  if (!canvas || !peaks || !peaks.length) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const mid = h * 0.5;
  const stride = 7;
  const barW = 4.8;
  const minAmp = 6;
  const maxAmp = h * 0.46;
  const radius = 999;

  const cols = Math.max(1, Math.floor(w / stride));
  const n = peaks.length;

  const base = "rgba(255,255,255,0.16)";
  const done = "rgba(255,255,255,0.9)";

  const p = clamp01(progress01 || 0);
  const progX = p * w;

  const getPeak = (i) => peaks[Math.max(0, Math.min(n - 1, i))];

  for (let col = 0; col < cols; col++) {
    const x = col * stride;
    const t = cols <= 1 ? 0 : col / (cols - 1);
    const f = t * (n - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(n - 1, i0 + 1);
    const frac = f - i0;

    const p0 = getPeak(i0) * (1 - frac) + getPeak(i1) * frac;
    const pPrev = getPeak(i0 - 2) * (1 - frac) + getPeak(i1 - 2) * frac;
    const pNext = getPeak(i0 + 2) * (1 - frac) + getPeak(i1 + 2) * frac;
    const smooth = pPrev * 0.22 + p0 * 0.56 + pNext * 0.22;

    const shaped = Math.sqrt(Math.max(0, smooth));
    const amp = Math.max(minAmp, shaped * maxAmp);

    const y0 = mid - amp;
    const y1 = mid + amp;
    const hh = y1 - y0;
    const rx = x + (stride - barW) * 0.5;

    ctx.fillStyle = x <= progX ? done : base;

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(rx, y0, barW, hh, radius);
      ctx.fill();
    } else {
      const r = Math.min(barW, hh) * 0.5;
      ctx.beginPath();
      ctx.moveTo(rx + r, y0);
      ctx.lineTo(rx + barW - r, y0);
      ctx.quadraticCurveTo(rx + barW, y0, rx + barW, y0 + r);
      ctx.lineTo(rx + barW, y0 + hh - r);
      ctx.quadraticCurveTo(rx + barW, y0 + hh, rx + barW - r, y0 + hh);
      ctx.lineTo(rx + r, y0 + hh);
      ctx.quadraticCurveTo(rx, y0 + hh, rx, y0 + hh - r);
      ctx.lineTo(rx, y0 + r);
      ctx.quadraticCurveTo(rx, y0, rx + r, y0);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =======================================================
// App
// =======================================================
document.addEventListener("DOMContentLoaded", () => {

  // Header scroll polish
  const hdr = $(".hdr");
  const onScroll = () => {
    if (!hdr) return;
    hdr.classList.toggle("is-scrolled", window.scrollY > 6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Section reveal (minimal)
  const revealEls = $$("[data-reveal]");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Profile image
  if (PROFILE_IMG_URL) {
    const img = $(".bio-photo");
    if (img) img.style.backgroundImage = `url("${PROFILE_IMG_URL}")`;
  }

  // NOTE:
  // Your existing player logic, audio loading, waveform
  // peak generation, dock logic, and lightbox behavior
  // remain untouched elsewhere in this file in your project.
  //
  // This file intentionally focuses on stability + waveform draw.
});
