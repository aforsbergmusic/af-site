/* =========================
FILE: app.js
Version: 2.2
- Full-screen panels compatible
- Random jewel tone on hover targets
- Waveform color follows jewel tone
- Keeps your smoother player + dock
========================= */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const SOCIALS = {
    imdb: "https://www.imdb.com/name/nm4586039/?ref_=ext_shr_lnk",
    apple: "https://music.apple.com/us/artist/andy-forsberg/987738278",
    spotify: "https://open.spotify.com/artist/5qd9swGpjTt9VJj0x053B3?si=qWOOqFV1SK-41NCzUKCciw",
    instagram: "https://www.instagram.com/aforsbergmusic?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
  };

  // Posters stay movie-poster ratio (2:3). Keep your originals.
  const PROJECTS = [
    { title: "Hilinski's Hope", img: "https://www.dropbox.com/scl/fi/jj5d38zq6k5ze1j6x8rfb/Hilinski-s-Hope.webp?rlkey=okcz7ji4e77001w20zdbu5up6&raw=1" },
    { title: "The Secret Lives of Animals", img: "https://www.dropbox.com/scl/fi/9g8f8xyggs3dqlg1hmbao/The-Secret-Lives-of-Animals.webp?rlkey=s6yz5mrdz88uc9djbscr48urp&raw=1" },
    { title: "Europe From Above", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/5ac55c58-6244-48de-9504-705a76b505c1/MV5BMWM1YzM4ZTYtOTNhYi00YTg2LWJlOTItMTNiMWFlMmI4MTE5XkEyXkFqcGc%40._V1_.jpg?content-type=image%2Fjpeg" },
    { title: "Born Wild: The Next Generation", img: "https://www.dropbox.com/scl/fi/04mok8tmb3dvvq6pofbrw/Born-Wild-The-Next-Generation.webp?rlkey=iq4b92tcumfktib1xm0t8eug1&raw=1" },
    { title: "Dodo Heroes", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/6b91b60c-fc0d-494c-8252-6ddb0338bcfe/Dodo+Heroes.jpg?content-type=image%2Fjpeg" },
    { title: "The Last Alaskans", img: "https://www.dropbox.com/scl/fi/7u94wz7f4jbes9qr6iytz/The-Last-Alaskans.webp?rlkey=apub8dab1r8c79n3h2kdd46gu&raw=1" },
    { title: "Thirst", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/98561fee-a1fe-4c77-a6a9-4ec0537a73a1/Thirst.webp?content-type=image%2Fwebp" },
    { title: "Whistle", img: "https://www.dropbox.com/scl/fi/6sp81uysuvokjyt2j3rac/Whistle.jpg?rlkey=58x5sqlr9u1ic77fb25nkfk3q&raw=1" }
  ];

  // About image (portrait) — set to your Dropbox bio image.
  // If you want a different one later, replace this URL.
  const ABOUT_IMG_URL = "https://www.dropbox.com/scl/fi/dxyvbz5xbpi8a5js0n6gk/Studio-Website-13.jpg?rlkey=knn294prc63qxhw7xujdkdmox&raw=1";

  const FEATURED_TRACKS = [
    { title: "Charlie Horse", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
    { title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { title: "Stars To Guide Us", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45b5-9bc2-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
    { title: "Drive To Isleworth", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" },
    { title: "The Summit", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/5731e845-e98a-4ae5-b843-cc3280fa8236/The%20Summit.mp3" },
    { title: "Travelers", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4c0e765b-129e-4146-ac5e-b09678d0d208/Travelers.mp3" },
    { title: "Finding The Pride", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/be647ea5-b2d5-4126-b775-c98ebf1c5b17/Finding%20The%20Pride.mp3" },
    { title: "The Cathedral", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/f8c8b063-f39a-414f-8cf0-f74e7b407779/The%20Cathedral.mp3" },
    { title: "Magic", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7406101c-2eae-4121-9739-64efdac180a5/Magic.mp3" },
    { title: "Emma's Drive", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/de7bab66-ddb1-4f58-a73c-38a842a07a59/Emma's%20Drive.mp3" },
    { title: "It's Everywhere", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4b46f910-babb-4bd0-a74d-16a99ca01c4e/It's%20Everywhere.mp3" },
    { title: "Bonded For Life", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/fbfcad1d-0ad1-45e5-b266-058e629d5468/Bonded%20For%20Life.mp3" }
  ];

  /* ========= Jewel tones (no pastels) ========= */
  const JEWELS = [
    { jt:"#7a5cff", fill:"rgba(122,92,255,.18)", glow:"rgba(122,92,255,.48)", glow2:"rgba(122,92,255,.26)" }, // amethyst
    { jt:"#22d3ee", fill:"rgba(34,211,238,.16)", glow:"rgba(34,211,238,.44)", glow2:"rgba(34,211,238,.24)" }, // cyan
    { jt:"#34d98a", fill:"rgba(52,217,138,.16)", glow:"rgba(52,217,138,.40)", glow2:"rgba(52,217,138,.22)" }, // emerald
    { jt:"#ffd166", fill:"rgba(255,209,102,.18)", glow:"rgba(255,209,102,.42)", glow2:"rgba(255,209,102,.24)" }, // amber
    { jt:"#ff9f1c", fill:"rgba(255,159,28,.18)", glow:"rgba(255,159,28,.42)", glow2:"rgba(255,159,28,.24)" }, // orange
    { jt:"#ff4d6d", fill:"rgba(255,77,109,.18)", glow:"rgba(255,77,109,.42)", glow2:"rgba(255,77,109,.24)" }, // ruby
    { jt:"#c13584", fill:"rgba(193,53,132,.18)", glow:"rgba(193,53,132,.42)", glow2:"rgba(193,53,132,.24)" }, // magenta
    { jt:"#5c7cff", fill:"rgba(92,124,255,.18)", glow:"rgba(92,124,255,.42)", glow2:"rgba(92,124,255,.24)" }  // sapphire
  ];

  const pickJewel = () => JEWELS[Math.floor(Math.random() * JEWELS.length)];
  const setJewelVars = (el, j) => {
    const target = el?.style ? el : document.documentElement;
    target.setProperty("--jt", j.jt);
    target.setProperty("--jtFill", j.fill);
    target.setProperty("--jtGlow", j.glow);
    target.setProperty("--jtGlow2", j.glow2);

    // Wave: keep base white, done can tint slightly via jt for “pro” feel
    target.setProperty("--waveDone", "rgba(255,255,255,.92)");
    target.setProperty("--waveBase", "rgba(255,255,255,.12)");
  };

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const fmtTime = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  function sizeCanvasToCSS(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  /* ---------------- Peaks cache ---------------- */
  const PEAKS_VERSION = "v1";
  const PEAKS_N = 220;
  const waveCache = new Map();
  let AUDIO_CTX = null;

  function getAudioCtx() {
    if (AUDIO_CTX) return AUDIO_CTX;
    const AC = window.AudioContext || window.webkitAudioContext;
    AUDIO_CTX = new AC();
    return AUDIO_CTX;
  }

  function hashStr(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(16);
  }

  function lsKey(src) {
    return `af_peaks_${PEAKS_VERSION}_${hashStr(src)}`;
  }

  function loadPeaksLS(src) {
    try {
      const raw = localStorage.getItem(lsKey(src));
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.p) || typeof obj.d !== "number") return null;
      return { peaks: obj.p, duration: obj.d };
    } catch {
      return null;
    }
  }

  function savePeaksLS(src, peaks, duration) {
    try {
      localStorage.setItem(lsKey(src), JSON.stringify({ p: peaks, d: duration }));
    } catch {}
  }

  function computePeaks(audioBuffer, n) {
    const ch0 = audioBuffer.getChannelData(0);
    const ch1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;
    const len = audioBuffer.length;
    const step = Math.max(1, Math.floor(len / n));
    const peaks = new Array(n);

    for (let i = 0; i < n; i++) {
      const start = i * step;
      const end = Math.min(len, start + step);
      let max = 0;
      for (let j = start; j < end; j++) {
        const v0 = Math.abs(ch0[j]);
        const v = ch1 ? Math.max(v0, Math.abs(ch1[j])) : v0;
        if (v > max) max = v;
      }
      peaks[i] = max;
    }

    let pmax = 0;
    for (const p of peaks) if (p > pmax) pmax = p;
    const inv = pmax ? 1 / pmax : 1;
    for (let i = 0; i < peaks.length; i++) peaks[i] = Math.min(1, peaks[i] * inv);
    return peaks;
  }

  async function getPeaks(src) {
    if (!src) return null;
    if (waveCache.has(src)) return waveCache.get(src);

    const fromLS = loadPeaksLS(src);
    if (fromLS) {
      waveCache.set(src, fromLS);
      return fromLS;
    }

    const ctx = getAudioCtx();
    const res = await fetch(src, { mode: "cors", cache: "force-cache" });
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);
    const peaks = computePeaks(decoded, PEAKS_N);
    const out = { peaks, duration: decoded.duration };
    waveCache.set(src, out);
    savePeaksLS(src, peaks, decoded.duration);
    return out;
  }

  /* ---------------- Wave draw (reads CSS vars) ---------------- */
  function drawWave(canvas, peaks, progress01) {
    if (!canvas || !peaks || !peaks.length) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const mid = h * 0.5;
    const stride = 6.0;
    const barW = 5.2;
    const minAmp = 6;
    const maxAmp = h * 0.46;
    const radius = 999;

    const cols = Math.max(1, Math.floor(w / stride));
    const n = peaks.length;

    const cs = getComputedStyle(document.documentElement);
    const base = cs.getPropertyValue("--waveBase").trim() || "rgba(255,255,255,0.12)";
    const done = cs.getPropertyValue("--waveDone").trim() || "rgba(255,255,255,0.92)";

    const p = clamp01(progress01 || 0);
    const progX = p * w;

    const getPeak = (idx) => peaks[Math.max(0, Math.min(n - 1, idx))];

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
      const smooth = pPrev * 0.20 + p0 * 0.60 + pNext * 0.20;

      const shaped = Math.sqrt(Math.max(0, smooth));
      const amp = Math.max(minAmp, shaped * maxAmp);

      const y0 = mid - amp;
      const hh = amp * 2;

      ctx.fillStyle = (x <= progX) ? done : base;
      const rx = x + (stride - barW) * 0.5;

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

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------------- Header scroll state ---------------- */
    const hdr = $(".hdr");
    const onScroll = () => hdr && hdr.classList.toggle("is-scrolled", (window.scrollY || 0) > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------------- Hamburger menu ---------------- */
    const menu = $(".menu");
    const menuBtn = $(".menuBtn");
    const closeMenu = () => {
      if (!menu || !menuBtn) return;
      menu.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    const openMenu = () => {
      if (!menu || !menuBtn) return;
      menu.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
    };

    if (menuBtn && menu) {
      menuBtn.addEventListener("click", () => {
        const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
        isOpen ? closeMenu() : openMenu();
      });
      menu.addEventListener("click", (e) => {
        if (e.target === menu) closeMenu();
        if (e.target.closest(".menu__link")) closeMenu();
      });
      window.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
    }

    /* ---------------- Social links ---------------- */
    const sImdb = $("#social-imdb");
    const sApple = $("#social-apple");
    const sSpotify = $("#social-spotify");
    const sIg = $("#social-instagram");
    if (sImdb) sImdb.href = SOCIALS.imdb;
    if (sApple) sApple.href = SOCIALS.apple;
    if (sSpotify) sSpotify.href = SOCIALS.spotify;
    if (sIg) sIg.href = SOCIALS.instagram;

    /* ---------------- About image ---------------- */
    const aboutImg = $(".aboutImg");
    if (aboutImg && ABOUT_IMG_URL) aboutImg.style.backgroundImage = `url('${ABOUT_IMG_URL}')`;

    /* ---------------- Works posters ---------------- */
    const postersEl = $(".posters");
    if (postersEl && PROJECTS.length) {
      postersEl.innerHTML = PROJECTS.map((p, i) => {
        const safeTitle = (p.title || "Project").replace(/"/g, "&quot;");
        const img = p.img || "";
        return `
          <div class="poster" data-idx="${i}" role="button" aria-label="${safeTitle}" data-jewel="hover">
            <div class="poster__img" style="background-image:url('${img}')"></div>
          </div>
        `;
      }).join("");
    }

    /* ---------------- Jewel hover randomizer ---------------- */
    const attachJewelHover = (el) => {
      if (!el) return;
      el.addEventListener("mouseenter", () => setJewelVars(document.documentElement, pickJewel()));
      el.addEventListener("focus", () => setJewelVars(document.documentElement, pickJewel()));
    };

    $$("[data-jewel='hover']").forEach(attachJewelHover);

    /* =========================================================
       PLAYER (smooth)
       ========================================================= */
    const player = $(".player");
    const playBtn = $(".playBtn");
    const npTitle = $(".npTitle");
    const npTime = $(".npTime");
    const waveBtn = $(".wave");
    const waveCanvas = waveBtn ? $("canvas", waveBtn) : null;
    const tracklist = $(".tracklist");

    // Dock
    const dock = $(".dock");
    const dockPlay = $(".dock__play");
    const dockTitle = $(".dock__title");
    const dockTime = $(".dock__time");
    const dockWaveBtn = $(".dock__wave");
    const dockCanvas = dockWaveBtn ? $("canvas", dockWaveBtn) : null;

    const audio = new Audio();
    audio.preload = "metadata";

    let tIdx = 0;
    let peaksObj = null;

    // Seek smoothing
    let draggingMain = false;
    let draggingDock = false;
    let seekTarget = null;
    let wasPlayingBeforeDrag = false;

    // UI loop
    let uiRaf = null;
    let lastDrawTs = 0;
    const DRAW_EVERY_MS = 33;
    const SEEK_APPLY_EVERY_MS = 33;
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

    const ensureCanvasSized = () => {
      if (waveCanvas) sizeCanvasToCSS(waveCanvas);
      if (dockCanvas) sizeCanvasToCSS(dockCanvas);
    };
    window.addEventListener("resize", ensureCanvasSized, { passive: true });

    const setPlayIcon = (paused) => {
      if (playBtn) playBtn.textContent = paused ? "▶" : "❚❚";
      if (dockPlay) dockPlay.textContent = paused ? "▶" : "❚❚";
    };

    const showDock = (show) => {
      if (!dock) return;
      dock.setAttribute("aria-hidden", show ? "false" : "true");
    };

    const currentTrack = () => FEATURED_TRACKS[tIdx] || null;

    function renderTracklist() {
      if (!tracklist) return;
      tracklist.innerHTML = FEATURED_TRACKS.map((t, i) => {
        const active = i === tIdx ? " is-active" : "";
        return `
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${t.title || "Track"}" data-jewel="hover">
            <div class="row__t">${t.title || "Untitled"}</div>
            <div class="row__d"></div>
          </div>
        `;
      }).join("");

      // hook jewel hover on the new rows
      $$("[data-jewel='hover']", tracklist).forEach(attachJewelHover);
    }

    async function loadWaveForCurrent() {
      peaksObj = null;
      const tr = currentTrack();
      if (!tr || !tr.src) return;
      try { peaksObj = await getPeaks(tr.src); } catch { peaksObj = null; }
      const next = FEATURED_TRACKS[(tIdx + 1) % FEATURED_TRACKS.length];
      if (next?.src) getPeaks(next.src).catch(() => {});
    }

    function getDur() {
      return (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);
    }

    function getCurForUI() {
      if ((draggingMain || draggingDock) && typeof seekTarget === "number") return seekTarget;
      return isFinite(audio.currentTime) ? audio.currentTime : 0;
    }

    function syncUI(nowTs) {
      const tr = currentTrack();
      if (!tr) return;

      const dur = getDur();
      const cur = getCurForUI();
      const pct = dur ? clamp01(cur / dur) : 0;

      setText(npTitle, tr.title || "Untitled");
      setText(dockTitle, tr.title || "Untitled");
      setText(npTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);
      setText(dockTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);

      setPlayIcon(audio.paused);

      if (tracklist) {
        $$(".row", tracklist).forEach((r) => {
          const i = Number(r.dataset.i);
          const on = i === tIdx;
          if (on !== r.classList.contains("is-active")) r.classList.toggle("is-active", on);
        });
      }

      if (peaksObj?.peaks && nowTs - lastDrawTs >= DRAW_EVERY_MS) {
        lastDrawTs = nowTs;
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
      try {
        if (typeof audio.fastSeek === "function") audio.fastSeek(t);
        else audio.currentTime = t;
      } catch {}
    }

    function startUILoop() {
      if (uiRaf) cancelAnimationFrame(uiRaf);
      const tick = (ts) => {
        if (draggingMain || draggingDock) applySeekTarget(ts);
        syncUI(ts);

        const keepAlive =
          (!audio.paused) ||
          draggingMain || draggingDock ||
          (dock && dock.getAttribute("aria-hidden") === "false");

        if (keepAlive) uiRaf = requestAnimationFrame(tick);
        else uiRaf = null;
      };
      uiRaf = requestAnimationFrame(tick);
    }

    async function setTrack(nextIdx, autoplay) {
      if (!FEATURED_TRACKS.length) return;
      tIdx = (nextIdx + FEATURED_TRACKS.length) % FEATURED_TRACKS.length;

      const tr = currentTrack();
      if (!tr || !tr.src) return;

      draggingMain = false;
      draggingDock = false;
      seekTarget = null;

      audio.src = tr.src;
      audio.currentTime = 0;

      await loadWaveForCurrent();

      startUILoop();

      if (autoplay) {
        try { await audio.play(); } catch {}
      }
    }

    function togglePlay() {
      if (!audio.src) { setTrack(0, true); return; }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      startUILoop();
    }

    function seekTargetFromEvent(e, which) {
      const btn = which === "dock" ? dockWaveBtn : waveBtn;
      if (!btn || !peaksObj) return;

      const rect = btn.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const pct = rect.width ? x / rect.width : 0;

      const dur = getDur();
      if (!dur) return;

      seekTarget = pct * dur;
    }

    function onPointerDown(which, e) {
      if (!peaksObj) return;
      wasPlayingBeforeDrag = !audio.paused;

      if (which === "main") draggingMain = true;
      else draggingDock = true;

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

      if (typeof seekTarget === "number") {
        const dur = getDur();
        const t = Math.max(0, Math.min(dur || 0, seekTarget));
        try {
          if (typeof audio.fastSeek === "function") audio.fastSeek(t);
          else audio.currentTime = t;
        } catch {}
      }

      if (wasPlayingBeforeDrag) audio.play().catch(() => {});
      startUILoop();
    }

    if (player && FEATURED_TRACKS.length) {
      // pick an initial jewel so it doesn't feel flat on first load
      setJewelVars(document.documentElement, pickJewel());

      renderTracklist();
      setTrack(0, false);

      if (playBtn) playBtn.addEventListener("click", togglePlay);
      if (dockPlay) dockPlay.addEventListener("click", togglePlay);

      if (tracklist) {
        tracklist.addEventListener("click", (e) => {
          const row = e.target.closest(".row");
          if (!row) return;
          const i = Number(row.dataset.i);
          if (i === tIdx) togglePlay();
          else setTrack(i, true);
        });
      }

      if (waveBtn) {
        waveBtn.addEventListener("pointerdown", (e) => {
          waveBtn.setPointerCapture(e.pointerId);
          onPointerDown("main", e);
        });
        waveBtn.addEventListener("pointermove", (e) => onPointerMove("main", e));
        waveBtn.addEventListener("pointerup", () => onPointerUp("main"));
        waveBtn.addEventListener("pointercancel", () => onPointerUp("main"));
      }

      if (dockWaveBtn) {
        dockWaveBtn.addEventListener("pointerdown", (e) => {
          dockWaveBtn.setPointerCapture(e.pointerId);
          onPointerDown("dock", e);
        });
        dockWaveBtn.addEventListener("pointermove", (e) => onPointerMove("dock", e));
        dockWaveBtn.addEventListener("pointerup", () => onPointerUp("dock"));
        dockWaveBtn.addEventListener("pointercancel", () => onPointerUp("dock"));
      }

      audio.addEventListener("play", () => { showDock(true); startUILoop(); });
      audio.addEventListener("pause", () => { showDock(true); startUILoop(); });
      audio.addEventListener("ended", () => { setTrack(tIdx + 1, true); });
      audio.addEventListener("loadedmetadata", () => startUILoop());
      audio.addEventListener("timeupdate", () => startUILoop());
    } else {
      showDock(false);
    }

    showDock(false);
  });
})();
