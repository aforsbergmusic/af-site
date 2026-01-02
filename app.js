(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ===== Jewel tones (shared site-wide) ===== */
  const JEWELS = ["#7a5cff","#2563eb","#06b6d4","#22c55e","#f59e0b","#f97316","#ef4444","#db2777"];
  const pickJewel = () => JEWELS[Math.floor(Math.random() * JEWELS.length)];

  const setJewel = (hex) => {
    document.documentElement.style.setProperty("--jt", hex);
  };

  /* ===== Dropbox “raw=1” helper (if you paste dl=0 links) ===== */
  const toDropboxRaw = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("dropbox.com")) {
        u.searchParams.set("raw", "1");
        u.searchParams.delete("dl");
        return u.toString();
      }
      return url;
    } catch { return url; }
  };

  /* ===== Data ===== */
  const BIO_PIC = toDropboxRaw("https://www.dropbox.com/scl/fi/3b49pfk6pdgq0lh8851bl/Studio-Hygge-2023-20.jpeg?rlkey=mvh0b6wvlyy734zvw8z5jbuir&dl=0");

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

  const TRACKS = [
    { title: "Charlie Horse", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
    { title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { title: "Stars To Guide Us", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45b5-9bc2-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
    { title: "Drive To Isleworth", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" }
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

  /* ===== “Negative space” waveform drawing ===== */
  function drawWave(canvas, peaks, progress01) {
    if (!canvas || !peaks?.length) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const p = clamp01(progress01 || 0);
    const progX = p * w;

    // base “cutout” bars
    const base = "rgba(255,255,255,0.10)";
    // filled jewel bars
    const jewel = getComputedStyle(document.documentElement).getPropertyValue("--jt").trim() || "#7a5cff";

    const mid = h * 0.5;
    const stride = 6.0;
    const barW = 5.2;
    const minAmp = 6;
    const maxAmp = h * 0.46;
    const cols = Math.max(1, Math.floor(w / stride));
    const n = peaks.length;

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

      ctx.fillStyle = (x <= progX) ? jewel : base;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(rx, y0, barW, hh, 999);
        ctx.fill();
      } else {
        ctx.fillRect(rx, y0, barW, hh);
      }
    }
  }

  /* ===== Tiny peaks cache (fast enough, stable) ===== */
  const PEAKS_N = 220;
  const waveCache = new Map();
  let AUDIO_CTX = null;
  const getAudioCtx = () => (AUDIO_CTX ||= new (window.AudioContext || window.webkitAudioContext)());

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

    const ctx = getAudioCtx();
    const res = await fetch(src, { mode: "cors", cache: "force-cache" });
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);
    const peaks = computePeaks(decoded, PEAKS_N);
    const out = { peaks, duration: decoded.duration };
    waveCache.set(src, out);
    return out;
  }

  /* =========================================================
     HORIZONTAL RAIL (the fix)
     - scroll-snap container is #rail
     - wheel mapped to horizontal with preventDefault
       (needs passive:false for wheel)  [oai_citation:2‡Hostinger](https://www.hostinger.com/tutorials/web-design-trends?utm_source=chatgpt.com)
     ========================================================= */
  function setupRail() {
    const rail = $("#rail");
    if (!rail) return;

    const tiles = $$(".tile", rail);
    const prevBtn = $("[data-nav='prev']");
    const nextBtn = $("[data-nav='next']");
    const dotsWrap = $(".navDots");

    // dots
    if (dotsWrap) {
      dotsWrap.innerHTML = tiles.map((_, i) => `<span class="dot ${i===0?'is-on':''}" data-dot="${i}"></span>`).join("");
    }

    const snapTo = (i) => {
      const idx = Math.max(0, Math.min(tiles.length - 1, i));
      const x = idx * rail.clientWidth;
      rail.scrollTo({ left: x, behavior: "smooth" });
    };

    const getIndex = () => {
      const w = rail.clientWidth || 1;
      return Math.round(rail.scrollLeft / w);
    };

    const updateUI = () => {
      const i = getIndex();
      $$(".dot", dotsWrap || document).forEach(d => d.classList.toggle("is-on", Number(d.dataset.dot) === i));
    };

    prevBtn?.addEventListener("click", () => snapTo(getIndex() - 1));
    nextBtn?.addEventListener("click", () => snapTo(getIndex() + 1));

    dotsWrap?.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (!dot) return;
      snapTo(Number(dot.dataset.dot));
    });

    // Keyboard
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") snapTo(getIndex() + 1);
      if (e.key === "ArrowLeft") snapTo(getIndex() - 1);
    });

    // Wheel → horizontal (non-passive so preventDefault works)
    rail.addEventListener("wheel", (e) => {
      // ignore pinch zoom
      if (e.ctrlKey) return;

      const dx = Math.abs(e.deltaX);
      const dy = Math.abs(e.deltaY);
      const dominant = dy > dx ? e.deltaY : e.deltaX;

      // Prevent the browser from trying to scroll vertically (since vertical is forbidden)
      e.preventDefault();

      rail.scrollLeft += dominant;
    }, { passive: false });

    rail.addEventListener("scroll", () => updateUI(), { passive: true });

    // Brand click to home
    $$("[data-goto]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        snapTo(Number(el.dataset.goto));
      });
    });

    updateUI();
  }

  /* =========================================================
     Posters + Lightbox
     ========================================================= */
  function setupPosters() {
    const postersEl = $(".posters");
    if (!postersEl) return;

    postersEl.innerHTML = PROJECTS.map((p, i) => `
      <div class="poster" data-idx="${i}" role="button" aria-label="Open ${p.title}">
        <div class="poster__img" style="background-image:url('${p.img || ""}')"></div>
      </div>
    `).join("");

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

    postersEl.addEventListener("click", (e) => {
      const p = e.target.closest(".poster");
      if (!p) return;
      const idx = Number(p.dataset.idx);
      const item = PROJECTS[idx];
      if (item?.img) openLB(item.img);
    });

    lbBg?.addEventListener("click", closeLB);
    lbClose?.addEventListener("click", closeLB);
    window.addEventListener("keydown", (e) => e.key === "Escape" && closeLB());
  }

  /* =========================================================
     Player
     ========================================================= */
  function setupPlayer() {
    const playBtn = $(".playBtn");
    const npTitle = $(".npTitle");
    const npTime = $(".npTime");
    const waveBtn = $(".wave");
    const waveCanvas = waveBtn ? $("canvas", waveBtn) : null;
    const tracklist = $(".tracklist");

    if (!tracklist || !TRACKS.length) return;

    const audio = new Audio();
    audio.preload = "metadata";

    let idx = 0;
    let peaksObj = null;
    let raf = null;

    const setPlayIcon = () => { if (playBtn) playBtn.textContent = audio.paused ? "▶" : "❚❚"; };

    const renderTracklist = () => {
      tracklist.innerHTML = TRACKS.map((t, i) => `
        <div class="row ${i===idx?'is-active':''}" data-i="${i}">
          <div class="row__t">${t.title || "Untitled"}</div>
          <div class="row__d"></div>
        </div>
      `).join("");
    };

    const dur = () => (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.duration || 0);

    const tick = () => {
      const d = dur();
      const c = isFinite(audio.currentTime) ? audio.currentTime : 0;
      const pct = d ? clamp01(c / d) : 0;

      npTitle.textContent = TRACKS[idx]?.title || "Untitled";
      npTime.textContent = `${fmtTime(c)} / ${fmtTime(d)}`;
      setPlayIcon();

      if (waveCanvas && peaksObj?.peaks) {
        sizeCanvasToCSS(waveCanvas);
        drawWave(waveCanvas, peaksObj.peaks, pct);
      }

      // keep row highlight synced
      $$(".row", tracklist).forEach(r => {
        const i = Number(r.dataset.i);
        r.classList.toggle("is-active", i === idx);
      });

      if (!audio.paused) raf = requestAnimationFrame(tick);
      else raf = null;
    };

    const load = async (i, autoplay) => {
      idx = (i + TRACKS.length) % TRACKS.length;
      const t = TRACKS[idx];
      audio.src = t.src;
      audio.currentTime = 0;

      // jewel changes on track load (ties colors across site)
      setJewel(pickJewel());

      peaksObj = null;
      try { peaksObj = await getPeaks(t.src); } catch { peaksObj = null; }

      renderTracklist();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);

      if (autoplay) audio.play().catch(() => {});
    };

    const toggle = () => {
      if (!audio.src) { load(0, true); return; }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const seekFromEvent = (e) => {
      if (!peaksObj) return;
      const rect = waveBtn.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const pct = rect.width ? x / rect.width : 0;
      const d = dur();
      if (!d) return;
      audio.currentTime = pct * d;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    playBtn?.addEventListener("click", toggle);
    tracklist.addEventListener("click", (e) => {
      const row = e.target.closest(".row");
      if (!row) return;
      const i = Number(row.dataset.i);
      if (i === idx) toggle();
      else load(i, true);
    });

    waveBtn?.addEventListener("pointerdown", (e) => {
      waveBtn.setPointerCapture(e.pointerId);
      seekFromEvent(e);
    });
    waveBtn?.addEventListener("pointermove", (e) => {
      if (e.buttons) seekFromEvent(e);
    });

    audio.addEventListener("play", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
    audio.addEventListener("pause", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
    audio.addEventListener("ended", () => load(idx + 1, true));

    renderTracklist();
    load(0, false);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Set bio pic
    const bioPic = $("#bioPic");
    if (bioPic) bioPic.style.backgroundImage = `url('${BIO_PIC}')`;

    // Brand hover gets a jewel too
    const brandName = $("#brandName");
    brandName?.addEventListener("mouseenter", () => setJewel(pickJewel()));

    // Social hover also updates jewel so the whole site feels unified
    $$(".sbtn").forEach(a => a.addEventListener("mouseenter", () => setJewel(pickJewel())));

    setupRail();
    setupPosters();
    setupPlayer();
  });
})();
