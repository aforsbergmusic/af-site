/* =========================================================
   AF SITE — app.js (Museum Posters + Editorial Plates + Drift)
   Full app.js replacement
   ========================================================= */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const PROFILE_IMG_URL = ""; // optional headshot url

  const SOCIALS = {
    imdb: "https://www.imdb.com/name/nm4586039/?ref_=ext_shr_lnk",
    apple: "https://music.apple.com/us/artist/andy-forsberg/987738278",
    spotify: "https://open.spotify.com/artist/5qd9swGpjTt9VJj0x053B3?si=qWOOqFV1SK-41NCzUKCciw",
    instagram: "https://www.instagram.com/aforsbergmusic?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
  };

  /* ---------------- Jewel tone palette (no pastels) ---------------- */
  const JEWELS = ["#7a5cff","#5c7cff","#22d3ee","#34d98a","#a3e635","#ffd166","#ff9f1c","#ff4d6d","#c13584"];

  function hexToRgb(hex) {
    const h = String(hex).replace("#", "").trim();
    const n = h.length === 6 ? parseInt(h, 16) : 0x7a5cff;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function pickJewel(exceptHex) {
    if (!JEWELS.length) return "#7a5cff";
    if (JEWELS.length === 1) return JEWELS[0];
    let c = JEWELS[Math.floor(Math.random() * JEWELS.length)];
    if (exceptHex && JEWELS.length > 2) {
      let guard = 0;
      while (c === exceptHex && guard++ < 10) c = JEWELS[Math.floor(Math.random() * JEWELS.length)];
    }
    return c;
  }

  function applyJewelVars(el) {
    if (!el) return;
    const prev = el.__jt || null;
    const jt = pickJewel(prev);
    el.__jt = jt;

    const { r, g, b } = hexToRgb(jt);
    el.style.setProperty("--jt", jt);
    el.style.setProperty("--jtFill", `rgba(${r},${g},${b},.18)`);
    el.style.setProperty("--jtGlow2", `rgba(${r},${g},${b},.35)`);
  }

  /* ---------------- Content ---------------- */
  const PROJECTS = [
    { title: "Hilinski's Hope", img: "https://www.dropbox.com/scl/fi/jj5d38zq6k5ze1j6x8rfb/Hilinski-s-Hope.webp?rlkey=okcz7ji4e77001w20zdbu5up6&raw=1" },
    { title: "The Secret Lives of Animals", img: "https://www.dropbox.com/scl/fi/9g8f8xyggs3dqlg1hmbao/The-Secret-Lives-of-Animals.webp?rlkey=s6yz5mrdz88uc9djbscr48urp&raw=1" },
    { title: "Europe From Above", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/5ac55c58-6244-48de-9504-705a76b505c1/MV5BMWM1YzM4ZTYtOTNhYi00YTg2LWJlOTItMTNiMWFlMmI4MTE5XkEyXkFqcGc%40._V1_.jpg?content-type=image%2Fjpeg" },
    { title: "Born Wild: The Next Generation", img: "https://www.dropbox.com/scl/fi/04mok8tmb3dvvq6pofbrw/Born-Wild-The-Next-Generation.webp?rlkey=iq4b92tcumfktib1xm0t8eug1&raw=1" },
    { title: "Dodo Heroes", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/6b91b60c-fc0d-494c-8252-6ddb0338bcfe/Dodo+Heroes.jpg?content-type=image%2Fjpeg" },
    { title: "The Last Alaskans", img: "https://www.dropbox.com/scl/fi/7u94wz7f4jbes9qr6iytz/The-Last-Alaskans.webp?rlkey=apub8dab1r8c79n3h2kdd46gu&raw=1" },
    { title: "Thirst", img: "https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/98561fee-a1fe-4c77-a6a9-4ec0533a73a1/Thirst.webp?content-type=image%2Fwebp" },
    { title: "Whistle", img: "https://www.dropbox.com/scl/fi/6sp81uysuvokjyt2j3rac/Whistle.jpg?rlkey=58x5sqlr9u1ic77fb25nkfk3q&raw=1" }
  ];

  const STUDIO = [
    "https://www.dropbox.com/scl/fi/xt5oi8nnc5rnwpjryivh3/Studio-Website-1.jpg?rlkey=23euuj9l2dr6xm14o177gms3u&raw=1",
    "https://www.dropbox.com/scl/fi/rphhjgqjehuwjt4mkj35r/Studio-Website-4.jpg?rlkey=nlux8i541g627rx7e4zbrssge&raw=1",
    "https://www.dropbox.com/scl/fi/2ofmv0l2u6mezzmk3mq3u/Studio-Website-14.jpg?rlkey=km8kcveprykqpantxl5jhf2w0&raw=1",
    "https://www.dropbox.com/scl/fi/oyqeszrslesy3mzqx39py/Studio-Website-17.jpg?rlkey=cg41dzy78a3i4ztskargig6qo&raw=1",
    "https://www.dropbox.com/scl/fi/3f3nihn5g455tvfdfwg63/Studio-Website-22.jpg?rlkey=gbujpgv7k1mvyptgn4r0h41ef&raw=1",
    "https://www.dropbox.com/scl/fi/mptf3sr34x0kg4vvgwcwd/Studio-Website-24.jpg?rlkey=ated18wblqch5ksl1m4bqck68&raw=1",
    "https://www.dropbox.com/scl/fi/xm7obyp24uik0jm78d6yf/Studio-Website-27.jpg?rlkey=jnxf40i7a9vsqimx19rw8zjjo&raw=1"
  ];

  /* ---------------- Utilities ---------------- */
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
    } catch { return null; }
  }

  function savePeaksLS(src, peaks, duration) {
    try { localStorage.setItem(lsKey(src), JSON.stringify({ p: peaks, d: duration })); } catch {}
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
    if (fromLS) { waveCache.set(src, fromLS); return fromLS; }

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

    const base = "rgba(255,255,255,0.12)";
    const done = "rgba(255,255,255,0.92)";

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

  /* =========================================================
     Drift (subtle, cinematic)
     - each plate gets its own drift vector
     - moves slightly based on scroll position
     ========================================================= */
  function setupDrift() {
    const plates = $$(".plate");
    if (!plates.length) return;

    const items = plates.map((el) => {
      const inner = $(".plate__drift", el) || el;
      const dx = (Math.random() * 2 - 1) * 8;  // px
      const dy = (Math.random() * 2 - 1) * 8;  // px
      const phase = Math.random() * Math.PI * 2;
      return { el, inner, dx, dy, phase };
    });

    let raf = null;
    const tick = () => {
      raf = null;
      const vh = window.innerHeight || 800;
      const scrollY = window.scrollY || 0;

      for (const it of items) {
        const rect = it.el.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const t = (center / vh) * 2 - 1; // -1..1
        const sway = Math.sin((scrollY * 0.002) + it.phase);

        const x = it.dx * (t * 0.35) + sway * 2.2;
        const y = it.dy * (t * 0.35) + sway * 1.4;

        it.inner.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    /* Header scroll */
    const hdr = $(".hdr");
    const onHdrScroll = () => hdr && hdr.classList.toggle("is-scrolled", (window.scrollY || 0) > 6);
    window.addEventListener("scroll", onHdrScroll, { passive: true });
    onHdrScroll();

    /* Random jewel tone on hover (delegated) */
    const hoverTargets = (el) => el?.closest(".poster, .row, .wave, .playBtn, .menuBtn, .dock__inner, .plate");
    document.addEventListener("pointerenter", (e) => {
      const t = hoverTargets(e.target);
      if (t) applyJewelVars(t);
    }, true);

    /* Hamburger */
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

    /* Social links + ensure classes */
    const sImdb = $("#social-imdb");
    const sApple = $("#social-apple");
    const sSpotify = $("#social-spotify");
    const sIg = $("#social-instagram");
    if (sImdb) { sImdb.href = SOCIALS.imdb; sImdb.classList.add("imdb"); }
    if (sSpotify) { sSpotify.href = SOCIALS.spotify; sSpotify.classList.add("spotify"); }
    if (sApple) { sApple.href = SOCIALS.apple; sApple.classList.add("apple"); }
    if (sIg) { sIg.href = SOCIALS.instagram; sIg.classList.add("instagram"); }

    /* Bio image */
    const bioImg = $(".bioImg");
    if (bioImg && PROFILE_IMG_URL) bioImg.style.backgroundImage = `url('${PROFILE_IMG_URL}')`;

    /* ---------- Posters: museum wall (contain, no crop) ---------- */
    const postersEl = $(".posters");
    if (postersEl && PROJECTS.length) {
      postersEl.innerHTML = PROJECTS.map((p, i) => {
        const safeTitle = (p.title || "Project").replace(/"/g, "&quot;");
        const img = p.img || "";
        return `
          <div class="poster" data-idx="${i}" data-title="${safeTitle}" role="button" aria-label="Open ${safeTitle}">
            <div class="poster__img">
              <img loading="lazy" alt="${safeTitle}" src="${img}">
            </div>
            <div class="poster__name">${safeTitle}</div>
          </div>
        `;
      }).join("");
    }

    /* ---------- Studio placements (diptych / rail / anchor) ---------- */
    const diptych = $("#studio-diptych");
    const rail = $("#studio-rail");
    const anchor = $("#studio-anchor");

    const mkPlate = (src, variant) => `
      <div class="plate ${variant || ""}" role="button" aria-label="Open studio image" data-src="${src}">
        <div class="plate__frame">
          <div class="plate__drift">
            <img loading="lazy" alt="Studio photo" src="${src}">
          </div>
        </div>
      </div>
    `;

    if (diptych) {
      const a = STUDIO[0], b = STUDIO[1];
      diptych.innerHTML = [
        mkPlate(a, "plate--wide"),
        mkPlate(b, "plate--tall")
      ].join("");
    }

    if (rail) {
      // curated rail: a few “beats”
      const picks = [STUDIO[2], STUDIO[3], STUDIO[4], STUDIO[5]];
      rail.innerHTML = picks.map((src, idx) => mkPlate(src, idx % 2 ? "plate--wide" : "plate--tall")).join("");
    }

    if (anchor) {
      const src = STUDIO[6] || STUDIO[0];
      anchor.innerHTML = mkPlate(src, "plate--anchor");
    }

    /* ---------- Lightbox (works for posters + plates) ---------- */
    const lb = $(".lb");
    const lbImg = $(".lb__img");
    const lbBg = $(".lb__bg");
    const lbClose = $(".lb__close");

    const openLB = (imgUrl) => {
      if (!lb || !lbImg) return;
      lbImg.src = imgUrl;
      lb.setAttribute("aria-hidden", "false");
    };
    const closeLB = () => {
      if (!lb) return;
      lb.setAttribute("aria-hidden", "true");
      if (lbImg) lbImg.src = "";
    };

    if (lbBg) lbBg.addEventListener("click", closeLB);
    if (lbClose) lbClose.addEventListener("click", closeLB);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lb && lb.getAttribute("aria-hidden") === "false") closeLB();
    });

    // posters open
    if (postersEl) {
      postersEl.addEventListener("click", (e) => {
        const p = e.target.closest(".poster");
        if (!p) return;
        const idx = Number(p.dataset.idx);
        const item = PROJECTS[idx];
        if (item?.img) openLB(item.img);
      });
    }
    // plates open
    document.addEventListener("click", (e) => {
      const plate = e.target.closest(".plate");
      if (!plate) return;
      const src = plate.getAttribute("data-src");
      if (src) openLB(src);
    });

    /* Drift init */
    setupDrift();

    /* =========================================================
       PLAYER (your smooth version unchanged in behavior)
       ========================================================= */
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

    const player = $(".player");
    const playBtn = $(".playBtn");
    const npTitle = $(".npTitle");
    const npTime = $(".npTime");
    const waveBtn = $(".wave");
    const waveCanvas = waveBtn ? $("canvas", waveBtn) : null;
    const tracklist = $(".tracklist");

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

    let draggingMain = false;
    let draggingDock = false;
    let seekTarget = null;
    let wasPlayingBeforeDrag = false;

    let uiRaf = null;
    let lastDrawTs = 0;
    const DRAW_EVERY_MS = 33;
    const SEEK_APPLY_EVERY_MS = 33;
    let lastSeekApplyTs = 0;

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
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${t.title || "Track"}">
            <div class="row__t">${t.title || "Untitled"}</div>
            <div class="row__d"></div>
          </div>
        `;
      }).join("");
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
          draggingMain ||
          draggingDock ||
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

      showDock(false);
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
