(() => {
  // ===== Your assets (edit these safely) =====

  // Add your photo URL here (the one you used earlier).
  // Example: const PROFILE_IMG_URL = "https://.../andy.webp";
  const PROFILE_IMG_URL = https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/ea254815-d550-4fe0-b4d2-f47612e555aa/Studio+Hygge+2023-22.jpeg?content-type=image%2Fjpeg; // <-- paste your image URL here

  const PROJECTS = [
    { title:"Hilinski's Hope", img:"https://www.dropbox.com/scl/fi/jj5d38zq6k5ze1j6x8rfb/Hilinski-s-Hope.webp?rlkey=okcz7ji4e77001w20zdbu5up6&raw=1" },
    { title:"The Secret Lives of Animals", img:"https://www.dropbox.com/scl/fi/9g8f8xyggs3dqlg1hmbao/The-Secret-Lives-of-Animals.webp?rlkey=s6yz5mrdz88uc9djbscr48urp&raw=1" },
    { title:"Europe From Above", img:"https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/5ac55c58-6244-48de-9504-705a76b505c1/MV5BMWM1YzM4ZTYtOTNhYi00YTg2LWJlOTItMTNiMWFlMmI4MTE5XkEyXkFqcGc%40._V1_.jpg?content-type=image%2Fjpeg" },
    { title:"Born Wild: The Next Generation", img:"https://www.dropbox.com/scl/fi/04mok8tmb3dvvq6pofbrw/Born-Wild-The-Next-Generation.webp?rlkey=iq4b92tcumfktib1xm0t8eug1&raw=1" },
    { title:"Dodo Heroes", img:"https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/6b91b60c-fc0d-494c-8252-6ddb0338bcfe/Dodo+Heroes.jpg?content-type=image%2Fjpeg" },
    { title:"The Last Alaskans", img:"https://www.dropbox.com/scl/fi/7u94wz7f4jbes9qr6iytz/The-Last-Alaskans.webp?rlkey=apub8dab1r8c79n3h2kdd46gu&raw=1" },
    { title:"Thirst", img:"https://images.squarespace-cdn.com/content/693fe31c2851f35786f384ab/98561fee-a1fe-4c77-a6a9-4ec0537a73a1/Thirst.webp?content-type=image%2Fwebp" },
    { title:"Scars", img:"https://www.dropbox.com/scl/fi/sm6zq4342jk9ucoqwujw6/Scars.webp?rlkey=iwp93o1an9k0jgxp61w3kf2bg&raw=1" }
  ];

  const TRACKS = [
    { title:"Charlie Horse", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/9b1a0c45-e055-4c88-b7b3-5f68e21c868e/Charlie%20Horse.mp3" },
    { title:"Beneath The City", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7a797f68-c4b0-48a2-bd22-2e4d0d42cb3f/Beneath%20The%20City.mp3" },
    { title:"Stars To Guide Us", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e08b2007-7b7a-45e5-b9bc-5e16f7c663f1/Stars%20To%20Guide%20Us.mp3" },
    { title:"Drive To Isleworth", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/e021b12d-70ad-45ad-8372-54e5bad51945/Drive%20To%20Isleworth.mp3" },
    { title:"The Summit", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/5731e845-e98a-4ae5-b843-cc3280fa8236/The%20Summit.mp3" },
    { title:"Travelers", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4c0e765b-129e-4146-ac5e-b09678d0d208/Travelers.mp3" },
    { title:"Finding The Pride", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/be647ea5-b2d5-4126-b775-c98ebf1c5b17/Finding%20The%20Pride.mp3" },
    { title:"The Cathedral", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/f8c8b063-f39a-414f-8cf0-f74e7b407779/The%20Cathedral.mp3" },
    { title:"Magic", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/7406101c-2eae-4121-9739-64efdac180a5/Magic.mp3" },
    { title:"Emma's Drive", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/de7bab66-ddb1-4f58-a73c-38a842a07a59/Emma's%20Drive.mp3" },
    { title:"It's Everywhere", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/4b46f910-babb-4bd0-a74d-16a99ca01c4e/It's%20Everywhere.mp3" },
    { title:"Bonded For Life", src:"https://audio.squarespace-cdn.com/content/v2/namespaces/website/libraries/693fe31c2851f35786f384ab/assets/fbfcad1d-0ad1-45e5-b266-058e629d5468/Bonded%20For%20Life.mp3" }
  ];

  // ===== Utilities =====
  const $ = (s, r=document) => r.querySelector(s);

  function fmtTime(s){
    if(!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s/60);
    const r = Math.floor(s%60);
    return m + ":" + String(r).padStart(2,"0");
  }

  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function sizeCanvas(canvas){
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if(canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
    }
  }

  // Smooth filled waveform (Reelcrafter-ish)
  function drawFilledWave(canvas, peaks, progress01){
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const mid = h * 0.5;
    const pad = Math.floor(h * 0.14);
    const top = pad, bot = h - pad;

    // background faint wave
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    fillPath(peaks, 0);

    // progress overlay
    const px = progress01 * w;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0,0,px,h);
    ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    fillPath(peaks, 0);
    ctx.restore();

    // inner helper
    function fillPath(pks){
      const n = pks.length;
      if(!n) return;

      ctx.beginPath();
      // top edge
      for(let i=0;i<n;i++){
        const x = (i/(n-1)) * w;
        const a = pks[i] * (mid - top);
        ctx.lineTo(x, mid - a);
      }
      // bottom edge back
      for(let i=n-1;i>=0;i--){
        const x = (i/(n-1)) * w;
        const a = pks[i] * (bot - mid);
        ctx.lineTo(x, mid + a);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // ===== Peaks (cached) =====
  const PEAKS_N = 520;
  const PEAKS_VER = "v1";
  let AUDIO_CTX = null;

  function getAudioCtx(){
    if(AUDIO_CTX) return AUDIO_CTX;
    const AC = window.AudioContext || window.webkitAudioContext;
    AUDIO_CTX = new AC();
    return AUDIO_CTX;
  }

  function hashStr(str){
    let h=5381;
    for(let i=0;i<str.length;i++) h=((h<<5)+h)^str.charCodeAt(i);
    return (h>>>0).toString(16);
  }
  function lsKey(src){ return `af_peaks_${PEAKS_VER}_${hashStr(src)}`; }

  function loadPeaks(src){
    try{
      const raw = localStorage.getItem(lsKey(src));
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(!obj || !Array.isArray(obj.p) || typeof obj.d !== "number") return null;
      return obj;
    }catch(_){ return null; }
  }

  function savePeaks(src, peaks, dur){
    try{ localStorage.setItem(lsKey(src), JSON.stringify({p:peaks,d:dur})); }catch(_){}
  }

  function computePeaks(buf, n){
    const ch0 = buf.getChannelData(0);
    const ch1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : null;
    const len = buf.length;
    const step = Math.max(1, Math.floor(len / n));
    const out = new Array(n);

    for(let i=0;i<n;i++){
      const start = i*step;
      const end = Math.min(len, start+step);
      let m = 0;
      for(let j=start;j<end;j++){
        const v0 = Math.abs(ch0[j]);
        const v = ch1 ? Math.max(v0, Math.abs(ch1[j])) : v0;
        if(v > m) m = v;
      }
      out[i] = m;
    }
    let mx = 0;
    for(const v of out) if(v > mx) mx = v;
    const inv = mx ? 1/mx : 1;
    for(let i=0;i<out.length;i++) out[i] = Math.min(1, out[i] * inv);
    return out;
  }

  async function getPeaks(src){
    const cached = loadPeaks(src);
    if(cached) return cached;
    const ctx = getAudioCtx();
    const res = await fetch(src, { mode:"cors", cache:"force-cache" });
    const ab = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(ab);
    const peaks = computePeaks(decoded, PEAKS_N);
    const dur = decoded.duration;
    savePeaks(src, peaks, dur);
    return { p: peaks, d: dur };
  }

  // ===== Menu =====
  const menuBtn = $("#menuBtn");
  const menu = $("#menu");

  function setMenu(open){
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  menuBtn.addEventListener("click", () => {
    const open = menu.getAttribute("aria-hidden") === "true";
    setMenu(open);
  });
  menu.addEventListener("click", (e) => {
    if(e.target === menu) setMenu(false);
    if(e.target.classList.contains("menu__link")) setMenu(false);
  });

  // Footer year
  $("#y").textContent = String(new Date().getFullYear());

  // ===== Posters render + lightbox =====
  const posters = $("#posters");
  const lb = $("#lb");
  const lbImg = $("#lbImg");
  const lbBg = $("#lbBg");
  const lbClose = $("#lbClose");

  posters.innerHTML = PROJECTS.map((p, i) => `
    <button class="poster" type="button" data-i="${i}" aria-label="Open ${p.title}">
      <div class="poster__img" style="background-image:url('${p.img}')"></div>
      <div class="poster__name">${p.title}</div>
    </button>
  `).join("");

  function openLb(src, alt){
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.setAttribute("aria-hidden","false");
  }
  function closeLb(){
    lb.setAttribute("aria-hidden","true");
    lbImg.src = "";
  }
  posters.addEventListener("click", (e) => {
    const btn = e.target.closest(".poster");
    if(!btn) return;
    const p = PROJECTS[Number(btn.dataset.i)];
    openLb(p.img, p.title);
  });
  lbBg.addEventListener("click", closeLb);
  lbClose.addEventListener("click", closeLb);
  window.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeLb(); });

  // ===== Bio image =====
  if(PROFILE_IMG_URL){
    $("#bioImg").style.backgroundImage = `url('${PROFILE_IMG_URL}')`;
  }

  // ===== Audio Player (single shared audio) =====
  const audio = new Audio();
  audio.preload = "metadata";

  const playBtn = $("#playBtn");
  const playIcon = $("#playIcon");
  const npTitle = $("#npTitle");
  const npTime = $("#npTime");

  const waveBtn = $("#wave");
  const waveCanvas = $("#waveCanvas");
  const list = $("#tracklist");

  const dock = $("#dock");
  const dockPlay = $("#dockPlay");
  const dockTitle = $("#dockTitle");
  const dockTime = $("#dockTime");
  const dockWave = $("#dockWave");
  const dockCanvas = $("#dockCanvas");

  let idx = -1;
  let peaksObj = null;
  let raf = null;

  function setPlayingUI(playing){
    playIcon.textContent = playing ? "❚❚" : "▶";
    dockPlay.textContent = playing ? "❚❚" : "▶";
  }

  function ensureDockVisible(){
    // Only show when there is an active track (and either playing or paused with selection)
    dock.setAttribute("aria-hidden", (idx < 0) ? "true" : "false");
  }

  function renderList(){
    list.innerHTML = TRACKS.map((t,i)=>`
      <div class="row ${i===idx ? "is-active":""}" data-i="${i}">
        <div class="row__t">${t.title}</div>
        <div class="row__d" data-dur="${i}"></div>
      </div>
    `).join("");
  }

  async function loadTrack(i, autoplay){
    idx = i;
    const t = TRACKS[idx];
    npTitle.textContent = t.title;
    dockTitle.textContent = t.title;
    ensureDockVisible();

    audio.src = t.src;
    audio.currentTime = 0;

    renderList();
    peaksObj = null;

    try{
      peaksObj = await getPeaks(t.src);
    }catch(_){
      peaksObj = { p: new Array(PEAKS_N).fill(0.08), d: 0 };
    }

    sync(true);
    if(autoplay) audio.play().catch(()=>{});
  }

  function sync(force){
    const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj?.d || 0);
    const cur = isFinite(audio.currentTime) ? audio.currentTime : 0;
    npTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;
    dockTime.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;

    setPlayingUI(!audio.paused);
    ensureDockVisible();

    const pct = dur ? clamp01(cur/dur) : 0;

    if(peaksObj?.p){
      sizeCanvas(waveCanvas);
      sizeCanvas(dockCanvas);
      drawFilledWave(waveCanvas, peaksObj.p, pct);
      drawFilledWave(dockCanvas, peaksObj.p, pct);
    }

    if(force) return;
  }

  function startRAF(){
    if(raf) cancelAnimationFrame(raf);
    const tick = () => {
      sync(false);
      if(!audio.paused) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  // List click
  list.addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if(!row) return;
    const i = Number(row.dataset.i);
    if(i === idx){
      if(audio.paused) audio.play().catch(()=>{});
      else audio.pause();
    }else{
      loadTrack(i, true);
    }
  });

  // Play button
  playBtn.addEventListener("click", () => {
    if(idx < 0) loadTrack(0, true);
    else audio.paused ? audio.play().catch(()=>{}) : audio.pause();
  });

  // Dock play
  dockPlay.addEventListener("click", () => {
    if(idx < 0) loadTrack(0, true);
    else audio.paused ? audio.play().catch(()=>{}) : audio.pause();
  });

  // Seek
  function seekFromX(clientX, targetEl){
    if(idx < 0 || !peaksObj) return;
    const rect = targetEl.getBoundingClientRect();
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const pct = rect.width ? (x / rect.width) : 0;
    const dur = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (peaksObj.d || 0);
    if(dur) audio.currentTime = pct * dur;
    sync(true);
  }

  let dragging = false;
  waveBtn.addEventListener("pointerdown",(e)=>{ dragging=true; waveBtn.setPointerCapture(e.pointerId); seekFromX(e.clientX, waveBtn); });
  waveBtn.addEventListener("pointermove",(e)=>{ if(dragging) seekFromX(e.clientX, waveBtn); });
  waveBtn.addEventListener("pointerup",()=>{ dragging=false; });
  waveBtn.addEventListener("pointercancel",()=>{ dragging=false; });

  let ddrag = false;
  dockWave.addEventListener("pointerdown",(e)=>{ ddrag=true; dockWave.setPointerCapture(e.pointerId); seekFromX(e.clientX, dockWave); });
  dockWave.addEventListener("pointermove",(e)=>{ if(ddrag) seekFromX(e.clientX, dockWave); });
  dockWave.addEventListener("pointerup",()=>{ ddrag=false; });
  dockWave.addEventListener("pointercancel",()=>{ ddrag=false; });

  // Audio events
  audio.addEventListener("play", () => { startRAF(); sync(true); });
  audio.addEventListener("pause", () => { sync(true); });
  audio.addEventListener("timeupdate", () => { sync(false); });
  audio.addEventListener("ended", () => {
    if(TRACKS.length) loadTrack((idx + 1) % TRACKS.length, true);
  });

  // Initial render (no autoplay, nothing open)
  renderList();
  ensureDockVisible();

  // Resize redraw
  window.addEventListener("resize", () => sync(true), { passive:true });
})();

