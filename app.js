/* ========================
FILE: app.js
======================== */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ========= Jewel palette (solid, not pastel) ========= */
  const JEWELS = [
    "#7a5cff", // amethyst
    "#5c7cff", // sapphire
    "#22d3ee", // cyan
    "#34d98a", // emerald
    "#a3e635", // peridot
    "#ffd166", // gold
    "#ff9f1c", // amber
    "#ff4d6d", // ruby
    "#c13584"  // magenta
  ];

  const pickJewel = () => JEWELS[Math.floor(Math.random() * JEWELS.length)];
  const setJT = (hex) => {
    const root = document.documentElement;
    root.style.setProperty("--jt", hex);
    root.style.setProperty("--jtFill", `color-mix(in srgb, ${hex} 18%, rgba(255,255,255,.02))`);
    root.style.setProperty("--jtFillStrong", `color-mix(in srgb, ${hex} 26%, rgba(255,255,255,.02))`);
  };

  /* ========= Data ========= */
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

  const FEATURED_TRACKS = [
    { title: "Charlie Horse", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
    { title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { title: "Stars To Guide Us", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45b5-9bc2-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
    { title: "Drive To Isleworth", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" },
    { title: "The Summit", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/5731e845-e98a-4ae5-b843-cc3280fa8236/The%20Summit.mp3" },
    { title: "Travelers", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4c0e765b-129e-4146-ac5e-b09678d0d208/Travelers.mp3" },
    { title: "Finding The Pride", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/be647ea5-b2d5-4126-b775-c98ebf1c5b17/Finding%20The%20Pride.mp3" },
    { title: "The Cathedral", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/f8c8b063-f39a-414f-8cf0-f74e7b407779/The%20Cathedral.mp3" }
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

  /* ========= Peaks cache ========= */
  const PEAKS_VERSION = "v2";
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

  /* ========= Negative-space waveform (fills with jewel tone) ========= */
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

    const cols = Math.max(1, Math.floor(w / stride));
    const n = peaks.length;

    const p = clamp01(progress01 || 0);
    const progX = p * w;

    const jt = (getComputedStyle(document.documentElement).getPropertyValue("--jt") || "#5c7cff").trim();

    const base = "rgba(255,255,255,0.10)";
    const done = jt;

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
        ctx.roundRect(rx, y0, barW, hh, 999);
        ctx.fill();
      } else {
        ctx.fillRect(rx, y0, barW, hh);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    /* ===== set initial jewel tone ===== */
    setJT(pickJewel());

    /* ===== hover randomizes across key interactive UI ===== */
    const jtTargets = [
      ...$$(".brand"),
      ...$$(".menuBtn"),
      ...$$(".menu__link"),
      ...$$(".sbtn"),
      ...$$(".navBtn"),
      ...$$(".pbtn"),
      ...$$(".row"),
      ...$$(".poster"),
      ...$$(".wave")
    ];
    jtTargets.forEach(el => {
      el.addEventListener("mouseenter", () => setJT(pickJewel()), { passive: true });
      el.addEventListener("focus", () => setJT(pickJewel()), { passive: true });
    });

    /* ===== Menu ===== */
    const menu = $(".menu");
    const menuBtn = $(".menuBtn");
    const rail = $(".rail");

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
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
    }

    /* ===== Tiles + nav ===== */
    const tiles = $$("[data-tile]");
    const byId = (id) => tiles.find(t => t.id === id);

    const getActiveIndex = () => {
      if (!rail) return 0;
      const x = rail.scrollLeft;
      const w = rail.clientWidth || 1;
      return Math.round(x / w);
    };

    const scrollToIndex = (idx) => {
      if (!rail) return;
      const w = rail.clientWidth || 1;
      rail.scrollTo({ left: idx * w, behavior: "smooth" });
    };

    const scrollToId = (id) => {
      const t = byId(id);
      if (!t || !rail) return;
      const idx = tiles.indexOf(t);
      if (idx >= 0) scrollToIndex(idx);
    };

    const interceptLinks = (root) => {
      $$('a[href^="#"]', root).forEach(a => {
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href") || "";
          const id = href.replace("#", "");
          if (!id) return;
          e.preventDefault();
          closeMenu();
          scrollToId(id);
          history.replaceState(null, "", `#${id}`);
        });
      });
    };
    interceptLinks(document);

    const initialHash = (location.hash || "").replace("#", "");
    if (initialHash) scrollToId(initialHash);

    const navPrev = $(".navPrev");
    const navNext = $(".navNext");
    if (navPrev) navPrev.addEventListener("click", () => scrollToIndex(Math.max(0, getActiveIndex() - 1)));
    if (navNext) navNext.addEventListener("click", () => scrollToIndex(Math.min(tiles.length - 1, getActiveIndex() + 1)));

    window.addEventListener("keydown", (e) => {
      if (!rail) return;
      if (menu && menu.getAttribute("aria-hidden") === "false") return;
      if (e.key === "ArrowRight") scrollToIndex(Math.min(tiles.length - 1, getActiveIndex() + 1));
      if (e.key === "ArrowLeft") scrollToIndex(Math.max(0, getActiveIndex() - 1));
    });

    if (rail) {
      rail.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        e.preventDefault();
        rail.scrollLeft += e.deltaY;
      }, { passive: false });
    }

    /* ===== Posters grid + lightbox ===== */
    const postersEl = $(".posters");
    if (postersEl && PROJECTS.length) {
      postersEl.innerHTML = PROJECTS.map((p, i) => {
        const safeTitle = (p.title || "Project").replace(/"/g, "&quot;");
        const img = p.img || "";
        return `
          <div class="poster" data-idx="${i}" role="button" aria-label="Open ${safeTitle}">
            <img class="poster__img" src="${img}" alt="" loading="lazy" decoding="async" />
            <div class="poster__name">${safeTitle}</div>
          </div>
        `;
      }).join("");
    }

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

    if (postersEl) {
      postersEl.addEventListener("click", (e) => {
        const p = e.target.closest(".poster");
        if (!p) return;
        const idx = Number(p.dataset.idx);
        const item = PROJECTS[idx];
        if (item && item.img) openLB(item.img);
      });
    }

    /* ===== Player ===== */
    const playBtn = $(".playBtn");
    const prevBtn = $(".prevBtn");
    const nextBtn = $(".nextBtn");
    const muteBtn = $(".muteBtn");
    const volRange = $(".vol__range");

    const npTitle = $(".npTitle");
    const npTime = $(".npTime");
    const waveBtn = $(".waveBtn");
    const waveCanvas = waveBtn ? $("canvas", waveBtn) : null;
    const tracklist = $(".tracklist");

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.9;

    let tIdx = 0;
    let peaksObj = null;
    let dragging = false;
    let seekTarget = null;
    let uiRaf = null;
    let lastDrawTs = 0;
    const DRAW_EVERY_MS = 33;

    const setPlayIcon = () => {
      if (!playBtn) return;
      playBtn.textContent = audio.paused ? "▶" : "❚❚";
    };

    const renderTracklist = () => {
      if (!tracklist) return;
      tracklist.innerHTML = FEATURED_TRACKS.map((t, i) => {
        const active = i === tIdx ? " is-active" : "";
        return `
          <div class="row${active}" data-i="${i}" role="button" aria-label="Play ${t.title || "Track"}">
            <div class="row__t">${t.title || "Untitled"}</div>
          </div>
        `;
      }).join("");
    };

    const currentTrack = () => FEATURED_TRACKS[tIdx] || null;

    const ensureCanvasSized = () => { if (waveCanvas) sizeCanvasToCSS(waveCanvas); };
    window.addEventListener("resize", ensureCanvasSized, { passive: true });

    const getDur = () => (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);

    const getCurForUI = () => {
      if (dragging && typeof seekTarget === "number") return seekTarget;
      return isFinite(audio.currentTime) ? audio.currentTime : 0;
    };

    const syncUI = (ts) => {
      const tr = currentTrack();
      if (!tr) return;

      const dur = getDur();
      const cur = getCurForUI();
      const pct = dur ? clamp01(cur / dur) : 0;

      if (npTitle) npTitle.textContent = tr.title || "Untitled";
      if (npTime) npTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;

      setPlayIcon();

      if (tracklist) {
        $$(".row", tracklist).forEach((r) => {
          const i = Number(r.dataset.i);
          r.classList.toggle("is-active", i === tIdx);
        });
      }

      if (peaksObj?.peaks && waveCanvas && ts - lastDrawTs >= DRAW_EVERY_MS) {
        lastDrawTs = ts;
        ensureCanvasSized();
        drawWave(waveCanvas, peaksObj.peaks, pct);
      }
    };

    const startUILoop = () => {
      if (uiRaf) cancelAnimationFrame(uiRaf);
      const tick = (ts) => {
        syncUI(ts);
        const keep = !audio.paused || dragging;
        if (keep) uiRaf = requestAnimationFrame(tick);
        else uiRaf = null;
      };
      uiRaf = requestAnimationFrame(tick);
    };

    const loadWaveForCurrent = async () => {
      peaksObj = null;
      const tr = currentTrack();
      if (!tr?.src) return;
      try { peaksObj = await getPeaks(tr.src); } catch { peaksObj = null; }
      const next = FEATURED_TRACKS[(tIdx + 1) % FEATURED_TRACKS.length];
      if (next?.src) getPeaks(next.src).catch(() => {});
    };

    const setTrack = async (nextIdx, autoplay) => {
      if (!FEATURED_TRACKS.length) return;
      tIdx = (nextIdx + FEATURED_TRACKS.length) % FEATURED_TRACKS.length;

      const tr = currentTrack();
      if (!tr?.src) return;

      dragging = false;
      seekTarget = null;

      audio.src = tr.src;
      audio.currentTime = 0;

      await loadWaveForCurrent();
      startUILoop();

      if (autoplay) {
        try { await audio.play(); } catch {}
      }
    };

    const togglePlay = () => {
      if (!audio.src) { setTrack(0, true); return; }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      startUILoop();
    };

    const stepTrack = (dir) => setTrack(tIdx + dir, true);

    const seekFromEvent = (e) => {
      if (!waveBtn) return;
      const rect = waveBtn.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const pct = rect.width ? x / rect.width : 0;
      const dur = getDur();
      if (!dur) return;
      seekTarget = pct * dur;
    };

    const commitSeek = () => {
      if (typeof seekTarget !== "number") return;
      const dur = getDur();
      const t = Math.max(0, Math.min(dur || 0, seekTarget));
      try {
        if (typeof audio.fastSeek === "function") audio.fastSeek(t);
        else audio.currentTime = t;
      } catch {}
    };

    if (playBtn) playBtn.addEventListener("click", togglePlay);
    if (prevBtn) prevBtn.addEventListener("click", () => stepTrack(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => stepTrack(1));

    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
        muteBtn.textContent = audio.muted ? "🔇" : "🔈";
      });
    }

    if (volRange) {
      volRange.addEventListener("input", () => {
        audio.volume = Number(volRange.value);
      }, { passive: true });
    }

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
        if (!peaksObj) return;
        waveBtn.setPointerCapture(e.pointerId);
        dragging = true;
        if (!audio.paused) audio.pause();
        seekFromEvent(e);
        startUILoop();
      });
      waveBtn.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        seekFromEvent(e);
        startUILoop();
      });
      waveBtn.addEventListener("pointerup", () => {
        if (!dragging) return;
        dragging = false;
        commitSeek();
        audio.play().catch(() => {});
        startUILoop();
      });
      waveBtn.addEventListener("pointercancel", () => {
        dragging = false;
        commitSeek();
        startUILoop();
      });
    }

    audio.addEventListener("play", () => startUILoop());
    audio.addEventListener("pause", () => startUILoop());
    audio.addEventListener("ended", () => stepTrack(1));

    if (FEATURED_TRACKS.length) {
      renderTracklist();
      setTrack(0, false);
    }

    const repEmail = $("#rep-email");
    if (repEmail) repEmail.href = "mailto:andy@andyforsbergmusic.com"; // change if needed
  });
})(); 
