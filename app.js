/* =========================================================
   AF SITE — app.js (Full, smoother player)
   - Smoother seek (RAF + target, uses fastSeek when available)
   - Less jumpy UI (diffed text updates, throttled waveform draw)
   - Dock behaves like control surface (ReelCrafter-ish)
   AF SITE — app.js (Full, stable)
   + Random jewel tone hover (socials + posters) via CSS var --jt
  ========================================================= */

(() => {
@@ -32,9 +30,7 @@
const FEATURED_TRACKS = [
{ title: "Charlie Horse", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
{ title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { 
  title: "Stars To Guide Us",
  src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45b5-9bc2-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3"},
    { title: "Stars To Guide Us", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45e5-b9bc-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
{ title: "Drive To Isleworth", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" },
{ title: "The Summit", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/5731e845-e98a-4ae5-b843-cc3280fa8236/The%20Summit.mp3" },
{ title: "Travelers", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4c0e765b-129e-4146-ac5e-b09678d0d208/Travelers.mp3" },
@@ -65,7 +61,7 @@
}
}

  /* ---------------- Peaks cache ---------------- */
  // Peaks cache
const PEAKS_VERSION = "v1";
const PEAKS_N = 220;
const waveCache = new Map();
@@ -153,7 +149,7 @@
return out;
}

  /* ---------------- Waveform draw (solid pill bars) ---------------- */
  // Waveform draw: SOLID pills, minimal gap
function drawWave(canvas, peaks, progress01) {
if (!canvas || !peaks || !peaks.length) return;

@@ -201,6 +197,7 @@
const hh = amp * 2;

ctx.fillStyle = (x <= progX) ? done : base;

const rx = x + (stride - barW) * 0.5;

if (ctx.roundRect) {
@@ -225,14 +222,53 @@
}
}

  // ---------------------------
  // Jewel-tone randomizer
  // ---------------------------
  const JEWELS = [
    "#35d0ff", // cyan
    "#7c5cff", // amethyst
    "#ff4fd8", // magenta
    "#ffb020", // amber
    "#22f2a6", // mint
    "#ff5a5f", // coral
    "#2ee6a6", // emerald
    "#6a5cff", // deep violet
    "#00c2ff", // electric blue
    "#ff3fbf"  // hot pink
  ];

  function randJewel() {
    return JEWELS[Math.floor(Math.random() * JEWELS.length)];
  }

  function applyRandomJewelOnHover(els) {
    els.forEach((el) => {
      // Set an initial per-element color so first hover looks intentional
      el.style.setProperty("--jt", randJewel());

      el.addEventListener("pointerenter", () => {
        el.style.setProperty("--jt", randJewel());
      }, { passive: true });

      // Keyboard accessibility: tab focus also randomizes
      el.addEventListener("focus", () => {
        el.style.setProperty("--jt", randJewel());
      });
    });
  }

document.addEventListener("DOMContentLoaded", () => {
    /* ---------------- Header scroll state ---------------- */
    // Header scroll state
const hdr = $(".hdr");
    const onScroll = () => hdr && hdr.classList.toggle("is-scrolled", (window.scrollY || 0) > 6);
    const onScroll = () => {
      if (!hdr) return;
      hdr.classList.toggle("is-scrolled", (window.scrollY || 0) > 6);
    };
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

    /* ---------------- Hamburger menu ---------------- */
    // Hamburger menu
const menu = $(".menu");
const menuBtn = $(".menuBtn");
const closeMenu = () => {
@@ -257,10 +293,12 @@
if (e.target.closest(".menu__link")) closeMenu();
});

      window.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
}

    /* ---------------- Social links ---------------- */
    // Social links
const sImdb = $("#social-imdb");
const sApple = $("#social-apple");
const sSpotify = $("#social-spotify");
@@ -270,11 +308,17 @@
if (sSpotify) sSpotify.href = SOCIALS.spotify;
if (sIg) sIg.href = SOCIALS.instagram;

    /* ---------------- Bio image ---------------- */
    // Random jewel hover for socials (splash-style)
    applyRandomJewelOnHover($$(".sbtn"));

    // Bio image
const bioImg = $(".bioImg");
    if (bioImg && PROFILE_IMG_URL) bioImg.style.backgroundImage = `url('${PROFILE_IMG_URL}')`;
    if (bioImg && PROFILE_IMG_URL) {
      bioImg.style.backgroundImage = `url('${PROFILE_IMG_URL}')`;
    }
    if (bioImg) applyRandomJewelOnHover([bioImg]);

    /* ---------------- Reveal ---------------- */
    // Reveal
const revealEls = $$("[data-reveal]");
if (revealEls.length) {
const io = new IntersectionObserver((entries) => {
@@ -288,22 +332,25 @@
revealEls.forEach(el => io.observe(el));
}

    /* ---------------- Posters ---------------- */
    // Posters
const postersEl = $(".posters");
if (postersEl && PROJECTS.length) {
postersEl.innerHTML = PROJECTS.map((p, i) => {
const safeTitle = (p.title || "Project").replace(/"/g, "&quot;");
const img = p.img || "";
return `
          <div class="poster" data-idx="${i}" role="button" aria-label="Open ${safeTitle}">
          <div class="poster" data-idx="${i}" role="button" aria-label="Open ${safeTitle}" tabindex="0">
           <div class="poster__img" style="background-image:url('${img}')"></div>
           <div class="poster__name">${safeTitle}</div>
         </div>
       `;
}).join("");
}

    /* ---------------- Lightbox ---------------- */
    // Random jewel hover for posters (outline)
    applyRandomJewelOnHover($$(".poster"));

    // Lightbox
const lb = $(".lb");
const lbImg = $(".lb__img");
const lbBg = $(".lb__bg");
@@ -334,11 +381,20 @@
const item = PROJECTS[idx];
if (item && item.img) openLB(item.img);
});

      // Keyboard open
      postersEl.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const p = e.target.closest(".poster");
        if (!p) return;
        e.preventDefault();
        const idx = Number(p.dataset.idx);
        const item = PROJECTS[idx];
        if (item && item.img) openLB(item.img);
      });
}

    /* =========================================================
       PLAYER (ReelCrafter-ish smoothness)
       ========================================================= */
    // Player
const player = $(".player");
const playBtn = $(".playBtn");
const npTitle = $(".npTitle");
@@ -360,29 +416,8 @@

let tIdx = 0;
let peaksObj = null;

    // Seek smoothing
    let draggingMain = false;
    let draggingDock = false;
    let seekTarget = null;          // seconds
    let wasPlayingBeforeDrag = false;

    // UI loop
    let uiRaf = null;
    let lastDrawTs = 0;
    const DRAW_EVERY_MS = 33;       // ~30fps waveform draw
    const SEEK_APPLY_EVERY_MS = 33; // ~30fps seek apply
    let lastSeekApplyTs = 0;

    // Diffed DOM writes
    const lastText = new Map();
    const setText = (el, v) => {
      if (!el) return;
      const prev = lastText.get(el);
      if (prev === v) return;
      lastText.set(el, v);
      el.textContent = v;
    };
    let raf = null;
    let isSeeking = false;

const ensureCanvasSized = () => {
if (waveCanvas) sizeCanvasToCSS(waveCanvas);
@@ -407,7 +442,7 @@
tracklist.innerHTML = FEATURED_TRACKS.map((t, i) => {
const active = i === tIdx ? " is-active" : "";
return `
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${t.title || "Track"}">
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${t.title || "Track"}" tabindex="0">
           <div class="row__t">${t.title || "Untitled"}</div>
           <div class="row__d"></div>
         </div>
@@ -420,83 +455,41 @@
const tr = currentTrack();
if (!tr || !tr.src) return;
try { peaksObj = await getPeaks(tr.src); } catch { peaksObj = null; }
      // Prewarm next track peaks quietly (makes next-click feel instant)
      const next = FEATURED_TRACKS[(tIdx + 1) % FEATURED_TRACKS.length];
      if (next?.src) getPeaks(next.src).catch(() => {});
    }

    function getDur() {
      return (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);
}

    function getCurForUI() {
      // While dragging, show the seek target (feels “snappy”)
      if ((draggingMain || draggingDock) && typeof seekTarget === "number") return seekTarget;
      return isFinite(audio.currentTime) ? audio.currentTime : 0;
    }

    function syncUI(nowTs) {
    function syncUI() {
const tr = currentTrack();
if (!tr) return;

      const dur = getDur();
      const cur = getCurForUI();
      const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);
      const cur = isFinite(audio.currentTime) ? audio.currentTime : 0;
const pct = dur ? clamp01(cur / dur) : 0;

      setText(npTitle, tr.title || "Untitled");
      setText(dockTitle, tr.title || "Untitled");
      setText(npTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);
      setText(dockTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);
      if (npTitle) npTitle.textContent = tr.title || "Untitled";
      if (dockTitle) dockTitle.textContent = tr.title || "Untitled";
      if (npTime) npTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;
      if (dockTime) dockTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;

setPlayIcon(audio.paused);

      // Active row highlight (cheap)
      if (tracklist) {
        $$(".row", tracklist).forEach((r) => {
          const i = Number(r.dataset.i);
          const on = i === tIdx;
          if (on !== r.classList.contains("is-active")) r.classList.toggle("is-active", on);
        });
      }

      // Throttled draw
      if (peaksObj?.peaks && nowTs - lastDrawTs >= DRAW_EVERY_MS) {
        lastDrawTs = nowTs;
      if (peaksObj?.peaks) {
if (waveCanvas) { ensureCanvasSized(); drawWave(waveCanvas, peaksObj.peaks, pct); }
if (dockCanvas) { ensureCanvasSized(); drawWave(dockCanvas, peaksObj.peaks, pct); }
}
    }

    function applySeekTarget(nowTs) {
      if (typeof seekTarget !== "number") return;
      if (nowTs - lastSeekApplyTs < SEEK_APPLY_EVERY_MS) return;
      lastSeekApplyTs = nowTs;

      const dur = getDur();
      if (!dur) return;

      const t = Math.max(0, Math.min(dur, seekTarget));
      // fastSeek is smoother in some browsers
      try {
        if (typeof audio.fastSeek === "function") audio.fastSeek(t);
        else audio.currentTime = t;
      } catch {}
      $$(".row", tracklist || document).forEach((r) => {
        const i = Number(r.dataset.i);
        r.classList.toggle("is-active", i === tIdx);
      });
}

    function startUILoop() {
      if (uiRaf) cancelAnimationFrame(uiRaf);
      const tick = (ts) => {
        // If dragging, apply seek gently
        if (draggingMain || draggingDock) applySeekTarget(ts);

        syncUI(ts);

        // Keep loop running while audio is playing OR while dragging OR dock visible
        const keepAlive = (!audio.paused) || draggingMain || draggingDock || (dock && dock.getAttribute("aria-hidden") === "false");
        if (keepAlive) uiRaf = requestAnimationFrame(tick);
        else uiRaf = null;
    function startRAF() {
      if (raf) cancelAnimationFrame(raf);
      const tick = () => {
        syncUI();
        if (!audio.paused) raf = requestAnimationFrame(tick);
};
      uiRaf = requestAnimationFrame(tick);
      raf = requestAnimationFrame(tick);
}

async function setTrack(nextIdx, autoplay) {
@@ -506,18 +499,11 @@
const tr = currentTrack();
if (!tr || !tr.src) return;

      // Reset drag state
      draggingMain = false;
      draggingDock = false;
      seekTarget = null;

audio.src = tr.src;
audio.currentTime = 0;

await loadWaveForCurrent();

      showDock(false);       // dock appears on first play
      startUILoop();         // render cleanly
      syncUI();

if (autoplay) {
try { await audio.play(); } catch {}
@@ -528,62 +514,19 @@
if (!audio.src) { setTrack(0, true); return; }
if (audio.paused) audio.play().catch(() => {});
else audio.pause();
      startUILoop();
}

    function seekTargetFromEvent(e, which) {
    function seekFromPointer(e, which) {
const btn = which === "dock" ? dockWaveBtn : waveBtn;
if (!btn || !peaksObj) return;

const rect = btn.getBoundingClientRect();
const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
const pct = rect.width ? x / rect.width : 0;

      const dur = getDur();
      if (!dur) return;

      seekTarget = pct * dur;
    }

    // Main + Dock pointer behavior (ReelCrafter-ish: scrub previews, then apply smoothly)
    function onPointerDown(which, e) {
      if (!peaksObj) return;
      wasPlayingBeforeDrag = !audio.paused;

      if (which === "main") draggingMain = true;
      else draggingDock = true;

      // Optional: pause while scrubbing for “control surface” feel
      // (If you want it to keep playing while scrubbing, delete these 2 lines.)
      if (!audio.paused) audio.pause();

      seekTargetFromEvent(e, which);
      startUILoop();
    }

    function onPointerMove(which, e) {
      if ((which === "main" && !draggingMain) || (which === "dock" && !draggingDock)) return;
      seekTargetFromEvent(e, which);
      startUILoop();
    }

    function onPointerUp(which) {
      if (which === "main") draggingMain = false;
      else draggingDock = false;

      // Commit one final seek immediately
      if (typeof seekTarget === "number") {
        const dur = getDur();
        const t = Math.max(0, Math.min(dur || 0, seekTarget));
        try {
          if (typeof audio.fastSeek === "function") audio.fastSeek(t);
          else audio.currentTime = t;
        } catch {}
      }

      // Resume if it was playing before
      if (wasPlayingBeforeDrag) audio.play().catch(() => {});
      startUILoop();
      const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj.duration || 0);
      if (dur) audio.currentTime = pct * dur;
      syncUI();
}

if (player && FEATURED_TRACKS.length) {
@@ -601,47 +544,56 @@
if (i === tIdx) togglePlay();
else setTrack(i, true);
});

        tracklist.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          const row = e.target.closest(".row");
          if (!row) return;
          e.preventDefault();
          const i = Number(row.dataset.i);
          if (i === tIdx) togglePlay();
          else setTrack(i, true);
        });
}

if (waveBtn) {
waveBtn.addEventListener("pointerdown", (e) => {
          isSeeking = true;
waveBtn.setPointerCapture(e.pointerId);
          onPointerDown("main", e);
          seekFromPointer(e, "main");
});
        waveBtn.addEventListener("pointermove", (e) => onPointerMove("main", e));
        waveBtn.addEventListener("pointerup", () => onPointerUp("main"));
        waveBtn.addEventListener("pointercancel", () => onPointerUp("main"));
        waveBtn.addEventListener("pointermove", (e) => { if (isSeeking) seekFromPointer(e, "main"); });
        waveBtn.addEventListener("pointerup", () => { isSeeking = false; });
        waveBtn.addEventListener("pointercancel", () => { isSeeking = false; });
}

if (dockWaveBtn) {
dockWaveBtn.addEventListener("pointerdown", (e) => {
          isSeeking = true;
dockWaveBtn.setPointerCapture(e.pointerId);
          onPointerDown("dock", e);
          seekFromPointer(e, "dock");
});
        dockWaveBtn.addEventListener("pointermove", (e) => onPointerMove("dock", e));
        dockWaveBtn.addEventListener("pointerup", () => onPointerUp("dock"));
        dockWaveBtn.addEventListener("pointercancel", () => onPointerUp("dock"));
        dockWaveBtn.addEventListener("pointermove", (e) => { if (isSeeking) seekFromPointer(e, "dock"); });
        dockWaveBtn.addEventListener("pointerup", () => { isSeeking = false; });
        dockWaveBtn.addEventListener("pointercancel", () => { isSeeking = false; });
}

audio.addEventListener("play", () => {
showDock(true);
        startUILoop();
        syncUI();
        startRAF();
});
audio.addEventListener("pause", () => {
        // Keep dock visible once engaged (ReelCrafter style)
        syncUI();
showDock(true);
        startUILoop();
});
audio.addEventListener("ended", () => { setTrack(tIdx + 1, true); });
      audio.addEventListener("loadedmetadata", () => startUILoop());
      audio.addEventListener("timeupdate", () => startUILoop());
      audio.addEventListener("loadedmetadata", syncUI);
      audio.addEventListener("timeupdate", syncUI);
} else {
showDock(false);
}

    // Start with dock hidden until first interaction
showDock(false);
});
})();

