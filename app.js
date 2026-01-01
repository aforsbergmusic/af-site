/* =========================
FILE: app.js
Version: 2.3
- Stable player (no external libs)
- Fullscreen layout compatible
- Jewel hover randomization (no pastels)
- Works grid renderer (poster images)
========================= */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

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

  /* ========= Jewel tones (no pastels) ========= */
  const JEWELS = [
    { jt:"#7a5cff", fill:"rgba(122,92,255,.14)", glow:"rgba(122,92,255,.42)", glow2:"rgba(122,92,255,.22)" },
    { jt:"#22d3ee", fill:"rgba(34,211,238,.12)", glow:"rgba(34,211,238,.38)", glow2:"rgba(34,211,238,.20)" },
    { jt:"#34d98a", fill:"rgba(52,217,138,.12)", glow:"rgba(52,217,138,.34)", glow2:"rgba(52,217,138,.18)" },
    { jt:"#ffd166", fill:"rgba(255,209,102,.14)", glow:"rgba(255,209,102,.34)", glow2:"rgba(255,209,102,.18)" },
    { jt:"#ff9f1c", fill:"rgba(255,159,28,.14)", glow:"rgba(255,159,28,.34)", glow2:"rgba(255,159,28,.18)" },
    { jt:"#ff4d6d", fill:"rgba(255,77,109,.14)", glow:"rgba(255,77,109,.34)", glow2:"rgba(255,77,109,.18)" },
    { jt:"#c13584", fill:"rgba(193,53,132,.14)", glow:"rgba(193,53,132,.34)", glow2:"rgba(193,53,132,.18)" },
    { jt:"#5c7cff", fill:"rgba(92,124,255,.14)", glow:"rgba(92,124,255,.34)", glow2:"rgba(92,124,255,.18)" }
  ];
  const pickJewel = () => JEWELS[Math.floor(Math.random() * JEWELS.length)];
  const setJewelVars = (j) => {
    const root = document.documentElement;
    root.style.setProperty("--jt", j.jt);
    root.style.setProperty("--jtFill", j.fill);
    root.style.setProperty("--jtGlow", j.glow);
    root.style.setProperty("--jtGlow2", j.glow2);
  };

  /* ========= Your data ========= */
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
    { title: "Beneath The City", src: "https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" }
  ];

  /* ========= Waveform draw (simple + reliable) ========= */
  function drawWave(canvas, progress01) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cs = getComputedStyle(document.documentElement);
    const base = cs.getPropertyValue("--waveBase").trim() || "rgba(255,255,255,.12)";
    const done = cs.getPropertyValue("--waveDone").trim() || "rgba(255,255,255,.92)";

    const mid = h * 0.5;
    const bars = Math.max(28, Math.floor(w / 14));
    const barW = Math.max(3, Math.floor(w / (bars * 1.7)));
    const gap = Math.max(4, Math.floor((w - (bars * barW)) / (bars - 1)));
    const p = clamp01(progress01 || 0);
    const progX = p * w;

    // Deterministic pseudo-random heights (stable)
    let seed = 1337;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

    let x = 0;
    for (let i = 0; i < bars; i++) {
      const r = rnd();
      const amp = (0.15 + r * 0.85) * (h * 0.44);
      const y0 = mid - amp;
      const hh = amp * 2;

      ctx.fillStyle = (x <= progX) ? done : base;
      const radius = 999;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y0, barW, hh, radius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y0, barW, hh);
      }

      x += barW + gap;
      if (x > w) break;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Set initial jewel
    setJewelVars(pickJewel());

    // Hover jewel on brand name + posters + rows
    const brandName = $("#brandName");
    if (brandName) {
      brandName.addEventListener("mouseenter", () => setJewelVars(pickJewel()));
      brandName.addEventListener("focus", () => setJewelVars(pickJewel()));
    }

    // Menu
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

    // Posters
    const postersEl = $(".posters");
    if (postersEl) {
      postersEl.innerHTML = PROJECTS.map((p, i) => `
        <div class="poster" data-i="${i}" role="button" aria-label="${(p.title || "Project").replace(/"/g,"&quot;")}">
          <div class="poster__img" style="background-image:url('${p.img || ""}')"></div>
        </div>
      `).join("");

      $$(".poster", postersEl).forEach(el => {
        el.addEventListener("mouseenter", () => setJewelVars(pickJewel()));
      });
    }

    // Player
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

    let idx = 0;
    let raf = null;
    let dragging = false;
    let dragTarget = null;
    let wasPlaying = false;

    const showDock = (show) => {
      if (!dock) return;
      dock.setAttribute("aria-hidden", show ? "false" : "true");
    };

    const setPlayIcons = () => {
      const paused = audio.paused;
      if (playBtn) playBtn.textContent = paused ? "▶" : "❚❚";
      if (dockPlay) dockPlay.textContent = paused ? "▶" : "❚❚";
    };

    const setNowPlaying = () => {
      const t = TRACKS[idx] || { title:"—" };
      if (npTitle) npTitle.textContent = t.title || "—";
      if (dockTitle) dockTitle.textContent = t.title || "—";
    };

    const loadTrack = (i, autoplay = false) => {
      idx = (i + TRACKS.length) % TRACKS.length;
      const t = TRACKS[idx];
      if (!t || !t.src) return;
      audio.src = t.src;
      audio.currentTime = 0;
      setNowPlaying();
      setPlayIcons();
      startLoop();
      if (autoplay) audio.play().catch(() => {});
    };

    const startLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      const loop = () => {
        const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : 0;
        const cur = dragging && typeof dragTarget === "number" ? dragTarget : (isFinite(audio.currentTime) ? audio.currentTime : 0);

        if (npTime) npTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;
        if (dockTime) dockTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;

        const pct = dur ? clamp01(cur / dur) : 0;

        if (waveCanvas) { sizeCanvasToCSS(waveCanvas); drawWave(waveCanvas, pct); }
        if (dockCanvas) { sizeCanvasToCSS(dockCanvas); drawWave(dockCanvas, pct); }

        setPlayIcons();

        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const togglePlay = () => {
      if (!audio.src) loadTrack(0, true);
      else {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
      }
      showDock(true);
      startLoop();
    };

    const seekFromEvent = (e, el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
      const pct = r.width ? x / r.width : 0;
      const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : 0;
      return dur ? pct * dur : null;
    };

    const onDown = (e, which) => {
      const el = which === "dock" ? dockWaveBtn : waveBtn;
      if (!el) return;

      wasPlaying = !audio.paused;
      if (wasPlaying) audio.pause();

      dragging = true;
      dragTarget = seekFromEvent(e, el);
      showDock(true);
    };
    const onMove = (e, which) => {
      if (!dragging) return;
      const el = which === "dock" ? dockWaveBtn : waveBtn;
      dragTarget = seekFromEvent(e, el);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;

      if (typeof dragTarget === "number") {
        try { audio.currentTime = dragTarget; } catch {}
      }
      dragTarget = null;

      if (wasPlaying) audio.play().catch(() => {});
    };

    // Tracklist
    if (tracklist) {
      tracklist.innerHTML = TRACKS.map((t, i) => `
        <div class="row ${i === idx ? "is-active" : ""}" data-i="${i}">
          <div class="row__t">${t.title || "Untitled"}</div>
        </div>
      `).join("");

      tracklist.addEventListener("click", (e) => {
        const row = e.target.closest(".row");
        if (!row) return;
        const i = Number(row.dataset.i);
        setJewelVars(pickJewel());
        if (i === idx) togglePlay();
        else loadTrack(i, true);
      });

      $$(".row", tracklist).forEach(r => r.addEventListener("mouseenter", () => setJewelVars(pickJewel())));
    }

    // Buttons
    if (playBtn) playBtn.addEventListener("click", () => { setJewelVars(pickJewel()); togglePlay(); });
    if (dockPlay) dockPlay.addEventListener("click", () => { setJewelVars(pickJewel()); togglePlay(); });

    // Wave seek
    if (waveBtn) {
      waveBtn.addEventListener("pointerdown", (e) => { waveBtn.setPointerCapture(e.pointerId); onDown(e, "main"); });
      waveBtn.addEventListener("pointermove", (e) => onMove(e, "main"));
      waveBtn.addEventListener("pointerup", onUp);
      waveBtn.addEventListener("pointercancel", onUp);
    }
    if (dockWaveBtn) {
      dockWaveBtn.addEventListener("pointerdown", (e) => { dockWaveBtn.setPointerCapture(e.pointerId); onDown(e, "dock"); });
      dockWaveBtn.addEventListener("pointermove", (e) => onMove(e, "dock"));
      dockWaveBtn.addEventListener("pointerup", onUp);
      dockWaveBtn.addEventListener("pointercancel", onUp);
    }

    audio.addEventListener("play", () => { showDock(true); setPlayIcons(); });
    audio.addEventListener("pause", () => { showDock(true); setPlayIcons(); });
    audio.addEventListener("ended", () => loadTrack(idx + 1, true));

    window.addEventListener("resize", () => {
      if (waveCanvas) sizeCanvasToCSS(waveCanvas);
      if (dockCanvas) sizeCanvasToCSS(dockCanvas);
    }, { passive: true });

    // Init
    loadTrack(0, false);
    showDock(false);
    startLoop();
  });
})();
