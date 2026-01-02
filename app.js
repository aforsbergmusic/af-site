/* =========================================================
   AF — Horizontal Rail + Jewel System + Player (no loop)
   STRICT: no vertical scrolling inside tiles.
   ========================================================= */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- Paste YOUR real copy here ----------------
     You said your bio/rep info is wrong. I will NOT invent it.
     Put your correct text into these arrays/strings.
  ------------------------------------------------------------ */
  const COPY = {
    "bio-1": "",
    "bio-2": "",

    "rep-1": "",
    "rep-2": "",
    "rep-3": "",

    "listening-note": "",

    "about-1": "",
    "about-2": "",
    "about-3": ""
  };

  /* ---------------- Links ---------------- */
  const SOCIALS = {
    imdb: "https://www.imdb.com/name/nm4586039/?ref_=ext_shr_lnk",
    apple: "https://music.apple.com/us/artist/andy-forsberg/987738278",
    spotify: "https://open.spotify.com/artist/5qd9swGpjTt9VJj0x053B3?si=qWOOqFV1SK-41NCzUKCciw",
    instagram: "https://www.instagram.com/aforsbergmusic"
  };

  /* Bio photo (you can change anytime) */
  const BIO_IMG_URL = "https://www.dropbox.com/scl/fi/3b49pfk6pdgq0lh8851bl/Studio-Hygge-2023-20.jpeg?rlkey=mvh0b6wvlyy734zvw8z5jbuir&raw=1";

  /* Featured Projects (movie poster aspect 2:3) */
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

  /* Listening Room tracks */
  const FEATURED_TRACKS = [
    { title: "Charlie Horse", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
    { title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { title: "Stars To Guide Us", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45b5-9bc2-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
    { title: "Drive To Isleworth", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" }
  ];

  /* Jewel palette (solid, not pastel) */
  const JEWELS = [
    "#7a5cff", // amethyst
    "#00c2ff", // sapphire
    "#22d3ee", // arctic
    "#34d98a", // emerald
    "#a3e635", // peridot
    "#ffd166", // topaz
    "#ff9f1c", // amber
    "#ff4d6d", // ruby
    "#c13584"  // magenta
  ];

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

  /* ===== ReelCrafter-ish waveform: negative space base, jewel fill progress ===== */
  function drawWave(canvas, peaks, progress01, jtHex) {
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

    // base = carved/negative space feel
    const base = "rgba(255,255,255,0.10)";
    const fill = jtHex || "#7a5cff";

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
      const shaped = Math.sqrt(Math.max(0, p0));
      const amp = Math.max(minAmp, shaped * maxAmp);

      const y0 = mid - amp;
      const hh = amp * 2;
      const rx = x + (stride - barW) * 0.5;

      ctx.fillStyle = (x <= progX) ? fill : base;

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

  /* ---------------- Peaks cache (fast) ---------------- */
  const PEAKS_N = 220;
  const waveCache = new Map();
  let AUDIO_CTX = null;

  function getAudioCtx() {
    if (AUDIO_CTX) return AUDIO_CTX;
    const AC = window.AudioContext || window.webkitAudioContext;
    AUDIO_CTX = new AC();
    return AUDIO_CTX;
  }

  async function getPeaks(src) {
    if (!src) return null;
    if (waveCache.has(src)) return waveCache.get(src);

    const ctx = getAudioCtx();
    const res = await fetch(src, { mode: "cors", cache: "force-cache" });
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);

    const ch0 = decoded.getChannelData(0);
    const ch1 = decoded.numberOfChannels > 1 ? decoded.getChannelData(1) : null;
    const len = decoded.length;
    const step = Math.max(1, Math.floor(len / PEAKS_N));
    const peaks = new Array(PEAKS_N);

    for (let i = 0; i < PEAKS_N; i++) {
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

    // normalize
    let pmax = 0;
    for (const p of peaks) if (p > pmax) pmax = p;
    const inv = pmax ? 1 / pmax : 1;
    for (let i = 0; i < peaks.length; i++) peaks[i] = Math.min(1, peaks[i] * inv);

    const out = { peaks, duration: decoded.duration };
    waveCache.set(src, out);
    return out;
  }

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------------- Inject COPY ---------------- */
    $$("[data-copy]").forEach(el => {
      const k = el.getAttribute("data-copy");
      if (!k) return;
      el.textContent = COPY[k] || "";
    });

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
    const aboutImg = $(".aboutImg__img");
    if (aboutImg && BIO_IMG_URL) aboutImg.src = BIO_IMG_URL;

    /* ---------------- Menu ---------------- */
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

    /* ---------------- Rail nav + strict horizontal scroll ---------------- */
    const rail = $("#rail");
    const panels = $$(".panel");
    const navBtns = $$(".railNav__btn");
    const navLinks = $$("[data-nav]");

    const state = {
      idx: 0,
      jt: JEWELS[0]
    };

    const setJewel = (hex) => {
      state.jt = hex;
      const root = document.documentElement;
      root.style.setProperty("--jt", hex);
      root.style.setProperty("--jtFill", hexToRgba(hex, 0.18));
      root.style.setProperty("--jtGlow2", hexToRgba(hex, 0.25));
    };

    const pickJewel = () => JEWELS[Math.floor(Math.random() * JEWELS.length)];

    function hexToRgba(hex, a){
      const h = hex.replace("#","").trim();
      const full = h.length === 3 ? h.split("").map(c => c+c).join("") : h;
      const n = parseInt(full, 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    }

    function scrollToPanel(i) {
      if (!rail || !panels.length) return;
      const idx = Math.max(0, Math.min(panels.length - 1, i));
      state.idx = idx;

      // choose jewel per-panel move
      setJewel(pickJewel());

      const x = idx * rail.clientWidth;
      rail.scrollTo({ left: x, behavior: "smooth" });
    }

    // menu links + buttons
    navLinks.forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const i = Number(el.getAttribute("data-nav"));
        if (Number.isFinite(i)) scrollToPanel(i);
        closeMenu();
      });
    });

    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const step = Number(btn.getAttribute("data-step")) || 0;
        scrollToPanel(state.idx + step);
      });
    });

    // Trackpad wheel => horizontal ONLY (prevents vertical scroll everywhere)
    if (rail) {
      rail.addEventListener("wheel", (e) => {
        // Convert vertical wheel into horizontal movement
        // Must be passive:false to prevent vertical scrolling.
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        rail.scrollLeft += delta;
      }, { passive: false });

      // Keep idx in sync with snapping
      let snapTimer = null;
      rail.addEventListener("scroll", () => {
        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
          const w = rail.clientWidth || 1;
          const idx = Math.round(rail.scrollLeft / w);
          if (idx !== state.idx) {
            state.idx = idx;
            setJewel(pickJewel());
          }
        }, 80);
      }, { passive: true });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") scrollToPanel(state.idx + 1);
      if (e.key === "ArrowLeft") scrollToPanel(state.idx - 1);
    });

    // Brand click
    const brand = $(".brand");
    if (brand) brand.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToPanel(0);
    });

    // Initial jewel
    setJewel(pickJewel());

    /* ---------------- Projects grid + lightbox ---------------- */
    const grid = $(".projectsGrid");
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

    if (grid) {
      grid.innerHTML = PROJECTS.map((p, i) => `
        <div class="poster" data-i="${i}" role="button" aria-label="Open ${escapeHtml(p.title)}">
          <div class="poster__img" style="background-image:url('${p.img}')"></div>
        </div>
      `).join("");

      grid.addEventListener("click", (e) => {
        const card = e.target.closest(".poster");
        if (!card) return;
        const idx = Number(card.getAttribute("data-i"));
        const item = PROJECTS[idx];
        if (item?.img) openLB(item.img);
      });
    }

    if (lbBg) lbBg.addEventListener("click", closeLB);
    if (lbClose) lbClose.addEventListener("click", closeLB);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lb && lb.getAttribute("aria-hidden") === "false") closeLB();
    });

    function escapeHtml(s=""){
      return String(s).replace(/[&<>"']/g, (m) => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
      }[m]));
    }

    /* =========================================================
       PLAYER (no loop button)
       ========================================================= */
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
    audio.loop = false; // explicitly off

    let tIdx = 0;
    let peaksObj = null;

    let draggingMain = false;
    let draggingDock = false;
    let seekTarget = null;
    let wasPlayingBeforeDrag = false;

    let uiRaf = null;
    let lastDrawTs = 0;
    const DRAW_EVERY_MS = 33;

    const setText = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };

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
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${escapeHtml(t.title)}">
            <div class="row__t">${escapeHtml(t.title)}</div>
          </div>
        `;
      }).join("");

      // jewel fill on hover for player rows also
      $$(".row", tracklist).forEach(row => {
        row.addEventListener("mouseenter", () => setJewel(pickJewel()));
      });
    }

    async function loadWaveForCurrent() {
      peaksObj = null;
      const tr = currentTrack();
      if (!tr || !tr.src) return;
      try { peaksObj = await getPeaks(tr.src); } catch { peaksObj = null; }
    }

    function getDur() {
      return (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);
    }

    function getCurForUI() {
      if ((draggingMain || draggingDock) && typeof seekTarget === "number") return seekTarget;
      return isFinite(audio.currentTime) ? audio.currentTime : 0;
    }

    function syncUI(ts) {
      const tr = currentTrack();
      if (!tr) return;

      const dur = getDur();
      const cur = getCurForUI();
      const pct = dur ? clamp01(cur / dur) : 0;

      setText(npTitle, tr.title || "—");
      setText(dockTitle, tr.title || "—");
      setText(npTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);
      setText(dockTime, `${fmtTime(cur)} / ${fmtTime(dur)}`);

      setPlayIcon(audio.paused);

      // active row
      if (tracklist) {
        $$(".row", tracklist).forEach((r) => {
          const i = Number(r.getAttribute("data-i"));
          r.classList.toggle("is-active", i === tIdx);
        });
      }

      if (peaksObj?.peaks && ts - lastDrawTs >= DRAW_EVERY_MS) {
        lastDrawTs = ts;
        ensureCanvasSized();
        const jt = getComputedStyle(document.documentElement).getPropertyValue("--jt").trim() || "#7a5cff";
        if (waveCanvas) drawWave(waveCanvas, peaksObj.peaks, pct, jt);
        if (dockCanvas) drawWave(dockCanvas, peaksObj.peaks, pct, jt);
      }
    }

    function startUILoop() {
      if (uiRaf) cancelAnimationFrame(uiRaf);
      const tick = (ts) => {
        syncUI(ts);
        const keepAlive = (!audio.paused) || draggingMain || draggingDock || (dock && dock.getAttribute("aria-hidden") === "false");
        if (keepAlive) uiRaf = requestAnimationFrame(tick);
        else uiRaf = null;
      };
      uiRaf = requestAnimationFrame(tick);
    }

    async function setTrack(nextIdx, autoplay) {
      if (!FEATURED_TRACKS.length) return;
      tIdx = (nextIdx + FEATURED_TRACKS.length) % FEATURED_TRACKS.length;

      draggingMain = false;
      draggingDock = false;
      seekTarget = null;

      const tr = currentTrack();
      if (!tr?.src) return;

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

      // apply immediately (feels more reelcrafter-like)
      const t = Math.max(0, Math.min(dur, seekTarget));
      try {
        if (typeof audio.fastSeek === "function") audio.fastSeek(t);
        else audio.currentTime = t;
      } catch {}
    }

    function onPointerDown(which, e) {
      if (!peaksObj) return;
      wasPlayingBeforeDrag = !audio.paused;
      if (which === "main") draggingMain = true;
      else draggingDock = true;

      if (!audio.paused) audio.pause(); // control-surface feel
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

      if (wasPlayingBeforeDrag) audio.play().catch(() => {});
      startUILoop();
    }

    if (FEATURED_TRACKS.length) {
      renderTracklist();
      setTrack(0, false);

      if (playBtn) playBtn.addEventListener("click", () => { setJewel(pickJewel()); togglePlay(); });
      if (dockPlay) dockPlay.addEventListener("click", () => { setJewel(pickJewel()); togglePlay(); });

      if (tracklist) {
        tracklist.addEventListener("click", (e) => {
          const row = e.target.closest(".row");
          if (!row) return;
          const i = Number(row.getAttribute("data-i"));
          setJewel(pickJewel());
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
